import { Link } from "react-router-dom";
import HamburguerMenu from "./ADMH_Menu";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";

function SidebarUser() {
  const [nomeUsuario, setNomeUsuario] = useState("Carregando...");
  const [fotoPerfil, setFotoPerfil] = useState("");

  useEffect(() => {
    function sincronizarFotoPerfil(evento) {
      const novaFoto = evento?.detail?.fotoPerfil;

      if (typeof novaFoto === "string") {
        setFotoPerfil(novaFoto);
      }
    }

    async function mostrarDadosCadastrados() {
      try {
        const usuarioSalvo = localStorage.getItem("usuario");

        if (!usuarioSalvo) {
          console.error("Usuário não está logado ou ID não encontrado.");
          return;
        }

        const usuarioJSON = JSON.parse(usuarioSalvo);
        const idUsuario = usuarioJSON.id;

        if (!idUsuario) {
          console.error("ID do usuário não encontrado no localStorage.");
          return;
        }

        const res = await fetch(`http://localhost:8080/perfil/${idUsuario}`);

        if (!res.ok) {
          throw new Error("Erro ao buscar dados do servidor");
        }

        const usuario = await res.json();

        if (usuario) {
          setNomeUsuario(usuario.nome);
          setFotoPerfil(usuario.fotoPerfil || "");
        }
      } catch (error) {
        console.error("Deu erro ao buscar perfil:", error);
        setNomeUsuario("Erro ao carregar");
      }
    }

    window.addEventListener("perfil-atualizado", sincronizarFotoPerfil);
    mostrarDadosCadastrados();

    return () => {
      window.removeEventListener("perfil-atualizado", sincronizarFotoPerfil);
    };
  }, []);

  return (
    <div className="bg-green-900 flex flex-row justify-between lg:justify-evenly lg:flex-col min-h-10  lg:min-h-screen w-autolg:w-60 items-center">
      <div className="p-5">
        <img
          src={fotoPerfil || "/img/avatar.png"}
          alt="Foto de perfil do usuário"
          className="w-32 h-32 object-cover rounded-full border-2 m-auto"
        />
        <p className="lg:block hidden text-white text-center text-4xl font-bold">
          {nomeUsuario} <br />
        </p>
        <p className="lg:block hidden text-white text-center">
          ID:...{/*Colocar com props o id dinâmico aqui */}
        </p>
      </div>

      <HamburguerMenu
        icone={<Menu size={26} aria-hidden="true" />}
      >
        <section className="flex flex-col text-center text-white bg-green-950 rounded-xl w-full font-bold">
          <Link className="hover:bg-green-700 p-8 rounded-xl">PERFIL</Link>
          <Link
            to="/User/Historico"
            className="hover:bg-green-700 p-8 rounded-xl"
          >
            HISTÓRICO DE CONSULTAS
          </Link>
          <Link
            to="/User/Agendamentos"
            className="hover:bg-green-700 p-8 rounded-xl"
          >
            AGENDAR
          </Link>
          <Link to="/" className="hover:bg-green-700 p-8 rounded-xl">
            SAIR
          </Link>
        </section>
      </HamburguerMenu>
    </div>
  );
}

export default SidebarUser;
