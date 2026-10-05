import { CircleUserRoundIcon, LogOut, X } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import USERH_Menu from "./USERH_Menu";

function Navbar() {
  const navigate = useNavigate();

  // Usuário logado
  const [usuario, setUsuario] = useState(null);

  // Controla o popup de logout
  const [mostrarLogout, setMostrarLogout] = useState(false);

  // Verifica se existe usuário salvo
  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("usuario");

    if (usuarioSalvo) {
      try {
        setUsuario(JSON.parse(usuarioSalvo));
      } catch (error) {
        console.error("Erro ao ler usuário:", error);
        localStorage.removeItem("usuario");
      }
    }
  }, []);

  // Faz o logout
  function confirmarSaida() {
    localStorage.removeItem("usuario");
    setUsuario(null);
    setMostrarLogout(false);
    navigate("/");
  }

  return (
    <>
      {/* NAVBAR */}
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
          {/* SE NÃO ESTIVER LOGADO */}
          {!usuario ? (
            <>
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
            </>
          ) : (
            /* SE ESTIVER LOGADO */
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

              {/* BOTÃO SAIR */}
              <button
                onClick={() => setMostrarLogout(true)}
                className="p-5 hover:bg-slate-200 flex justify-center rounded-xl w-full text-left cursor-pointer"
              >
                SAIR
              </button>
            </USERH_Menu>
          )}
        </div>
      </div>

      {/* ================================= */}
      {/* POPUP DE CONFIRMAÇÃO DE LOGOUT */}
      {/* ================================= */}

      {mostrarLogout && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-[90%] max-w-md rounded-2xl bg-white p-7 shadow-2xl">
            {/* BOTÃO X */}
            <button
              type="button"
              onClick={() => setMostrarLogout(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800 cursor-pointer"
            >
              <X size={22} />
            </button>

            {/* ÍCONE */}
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <LogOut size={32} className="text-green-700" />
            </div>

            {/* TÍTULO */}
            <h2 className="text-center text-2xl font-bold text-green-950">
              Deseja sair?
            </h2>

            {/* TEXTO */}
            <p className="mt-3 text-center text-gray-500">
              Tem certeza que deseja sair da sua conta?
            </p>

            {/* BOTÕES */}
            <div className="mt-7 flex justify-center gap-3">
              {/* CANCELAR */}
              <button
                type="button"
                onClick={() => setMostrarLogout(false)}
                className="cursor-pointer rounded-lg bg-gray-200 px-5 py-2.5 font-medium text-gray-700 hover:bg-gray-300"
              >
                Cancelar
              </button>

              {/* CONFIRMAR */}
              <button
                type="button"
                onClick={confirmarSaida}
                className="cursor-pointer rounded-lg bg-green-700 px-5 py-2.5 font-medium text-white hover:bg-green-800"
              >
                Sim, sair
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
