import { Link } from "react-router-dom";
import HamburguerMenu from "./ADMH_Menu";
import { List } from "lucide-react";
import { useState, useEffect } from "react";

function SidebarUser() {
const [nomeUsuario, setNomeUsuario] = useState("Carregando...");
useEffect(() => {
  //Pega os dados do usuário no local storage e joga no banco
  async function mostrarDadosCadastrados() {
    try {
      
      
      // 1. Pega o ID do usuário que foi salvo no login lá no local storage
      const idUsuarioLogado = localStorage.getItem("usuario"); 

      if (!idUsuarioLogado) {
        console.error("Usuário não está logado ou ID não encontrado.");
        return;
      }

      const usuarioJSON = JSON.parse(idUsuarioLogado)

      const idUsuario = usuarioJSON.id

      // 2. Passa o ID diretamente na URL da requisição
      const res = await fetch(`http://localhost:8080/perfil/${idUsuario}`);
      
      if (!res.ok) {
        throw new Error("Erro ao buscar dados do servidor");
      }

      // 3. O res.json() deve ser chamado APENAS UMA VEZ
      const usuario = await res.json();
      
      // 4. Como o back-end vai devolver só um objeto, basta preencher os estados
      if (usuario) {
        setNomeUsuario(usuario.nome);
      }
    } catch (error) {
      console.error("Deu erro ao buscar perfil:", error);
      setNomeUsuario("Erro ao carregar");
      setEmailUsuario("Erro ao carregar");
    }
  }

  mostrarDadosCadastrados();
}, []);

  return (
    <div className="bg-green-900 flex flex-row justify-between lg:justify-evenly lg:flex-col min-h-10  lg:min-h-screen w-autolg:w-60 items-center">
      <div className="p-5">
        <img
          src="/img/mulher.jpg"
          alt=""
          className="rounded-[300px] border-2 w-20 lg:w-50 m-auto"
        />
        <p className="lg:block hidden text-white text-center text-4xl font-bold">
          {nomeUsuario
          } <br />
        </p>
        <p className="lg:block hidden text-white text-center">
          ID:...{/*Colocar com props o id dinâmico aqui */}
        </p>
      </div>

      <HamburguerMenu
        icone={<List size={40} color="white" className="cursor-pointer" />}
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
