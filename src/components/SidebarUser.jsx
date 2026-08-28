import { Link } from "react-router-dom";
import HamburguerMenu from "./ADMH_Menu";
import { List } from "lucide-react";

function SidebarUser() {
  return (
    <div className="bg-green-900 flex flex-row justify-between lg:justify-evenly lg:flex-col min-h-10  lg:min-h-screen w-autolg:w-60 items-center">
      <div className="p-5">
        <img
          src="/img/mulher.jpg"
          alt=""
          className="rounded-[300px] border-2 w-20 lg:w-50 m-auto"
        />
        <p className="lg:block hidden text-white text-center text-4xl font-bold">
          Ana Clara <br />
        </p>
        <p className="lg:block hidden text-white text-center">
          ID: 0001 {/*Colocar com props o id dinâmico aqui */}
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
