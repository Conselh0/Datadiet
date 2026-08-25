import { CircleUserRoundIcon } from "lucide-react";
import { Link } from "react-router-dom";
import USERH_Menu from "./USERH_Menu";

function Navbar() {
  return (
    <div className="w-full bg-emerald-900 flex justify-between p-3">
      <img
        src="/img/logo 2.png"
        alt="logoLuana"
        className="hidden sm:block w-[50px] h-[50px]"
      />

      <div className="flex flex-col items-start sm:items-center sm:flex-row sm:justify-center text-2xl text-white">
        <button className="mx-3 hover:underline decoration-2 decoration-green-400 underline-offset-4">
          <Link to="/">Home</Link>
        </button>

        <button className="mx-3 hover:underline decoration-2 decoration-green-400 underline-offset-4">
          <Link to="/">Sobre</Link>
        </button>

        <button className="mx-3 hover:underline decoration-2 decoration-green-400 underline-offset-4">
          <Link to="/Feedback">Feedback</Link>
        </button>

        <button className="mx-3 hover:underline decoration-2 decoration-green-400 underline-offset-4">
          <Link to="/">Contatos</Link>
        </button>
      </div>
      <USERH_Menu
        icone={
          <CircleUserRoundIcon
            className="cursor-pointer"
            color="white"
            size={40}
          />
        }
      >
        <Link to="/User" className="p-5 hover:bg-green-800">
          PERFIL
        </Link>
        <Link to="/User" className="p-5 hover:bg-green-800">
          AGENDAMENTO
        </Link>
        <Link to="/User" className="p-5 hover:bg-green-800">
          AGENDAR CONSULTA
        </Link>
        <Link to="/User" className="p-5 hover:bg-green-800">
          CONSULTA
        </Link>
        <Link to="/User" className="p-5 hover:bg-green-800">
          SAIR
        </Link>
      </USERH_Menu>
    </div>
  );
}

export default Navbar;
