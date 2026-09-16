import { CircleUserRoundIcon } from "lucide-react";
import { Link } from "react-router-dom";
import USERH_Menu from "./USERH_Menu";

function Navbar() {
  return (
    <div className="w-full bg-emerald-900 p-3 flex items-center justify-between">

      {/* LOGO */}
      <div>
        <img
          src="/img/logo 2.png"
          alt="logoLuana"
          className="hidden sm:block w-[50px] h-[50px]"
        />
      </div>

      {/* LINKS DO MEIO */}
      <div className="flex items-center justify-center text-2xl text-white">

        <Link
          to="/"
          className="mx-3 hover:underline decoration-2 decoration-green-400 underline-offset-4 hover:text-green-400"
        >
          Home
        </Link>

        <Link
          to="/"
          className="mx-3 hover:underline decoration-2 decoration-green-400 underline-offset-4 hover:text-green-400"
        >
          Sobre
        </Link>

        <Link
          to="/Feedback"
          className="mx-3 hover:underline decoration-2 decoration-green-400 underline-offset-4 hover:text-green-400"
        >
          Feedback
        </Link>

        <Link
          to="/"
          className="mx-3 hover:underline decoration-2 decoration-green-400 underline-offset-4 hover:text-green-400"
        >
          Contatos
        </Link>

      </div>

      {/* LADO DIREITO */}
      <div className="flex items-center gap-3">

        <Link to="/CadPa">
          <button className="cursor-pointer bg-green-700 p-2 rounded-md text-lg text-white">
            Cadastrar
          </button>
        </Link>

        <Link to="/LoginPa">
          <button className="cursor-pointer bg-green-700 p-2 rounded-md text-lg text-white">
            Entrar
          </button>
        </Link>

        <USERH_Menu
          icone={
            <CircleUserRoundIcon
              className="cursor-pointer"
              color="white"
              size={40}
            />
          }
        >
          <Link to="/User" className="p-5 hover:bg-slate-200 rounded-xl">
            PERFIL
          </Link>

          <Link to="/User" className="p-5 hover:bg-slate-200 rounded-xl">
            AGENDAMENTO
          </Link>

          <Link to="/User" className="p-5 hover:bg-slate-200 rounded-xl">
            AGENDAR CONSULTA
          </Link>

          <Link to="/User" className="p-5 hover:bg-slate-200 rounded-xl">
            CONSULTA
          </Link>

          <Link to="/User" className="p-5 hover:bg-slate-200 rounded-xl">
            SAIR
          </Link>
        </USERH_Menu>

      </div>

    </div>
  );
}

export default Navbar;