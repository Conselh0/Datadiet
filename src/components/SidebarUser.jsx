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
    <aside className="flex w-full shrink-0 flex-row items-center justify-between bg-green-900 lg:min-h-screen lg:w-64 lg:flex-col lg:justify-between lg:overflow-hidden">
      <div className="p-5 lg:w-full">
        <img
          src={fotoPerfil || "/img/avatar.png"}
          alt="Foto de perfil do usuário"
          className="m-auto h-24 w-24 rounded-full border-2 border-white/60 object-cover lg:h-28 lg:w-28"
        />
        <p className="hidden text-center text-2xl font-bold text-white lg:block">
          {nomeUsuario}
        </p>
        <p className="hidden text-center text-sm text-green-100/80 lg:block">
          Paciente
        </p>
      </div>

      <HamburguerMenu
        icone={<Menu size={26} aria-hidden="true" />}
      >
        <section className="flex w-full flex-col rounded-xl bg-green-950 text-center font-bold text-white">
          <Link className="rounded-xl p-4 text-sm hover:bg-green-700 lg:p-5">PERFIL</Link>
          <Link
            to="/User/Historico"
            className="rounded-xl p-4 text-sm hover:bg-green-700 lg:p-5"
          >
            HISTÓRICO DE CONSULTAS
          </Link>
          <Link
            to="/User/Agendamentos"
            className="rounded-xl p-4 text-sm hover:bg-green-700 lg:p-5"
          >
            AGENDAR
          </Link>
          <Link to="/" className="rounded-xl p-4 text-sm hover:bg-green-700 lg:p-5">
            SAIR
          </Link>
        </section>
      </HamburguerMenu>
    </aside>
  );
}

export default SidebarUser;
