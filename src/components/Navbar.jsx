import { useEffect, useState } from "react";
import { CircleUserRoundIcon, Menu, X, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import USERH_Menu from "./USERH_Menu";

function Navbar() {
  const navigate = useNavigate();

  const [menuAberto, setMenuAberto] = useState(false);

  // Usuário logado
  const [usuario, setUsuario] = useState(null);

  // Controla o popup de logout
  const [mostrarLogout, setMostrarLogout] = useState(false);

  // Verifica se existe usuário salvo no localStorage
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
    setMenuAberto(false);

    navigate("/");
  }

  return (
    <>
      {/* NAVBAR */}
      <div className="font-poppins w-full bg-emerald-900 p-3 flex items-center justify-between relative shadow-md h-20">
        {/* LADO ESQUERDO: LOGO E BOTÃO HAMBÚRGUER MOBILE */}
        <div className="z-10 flex items-center gap-2 pl-2">
          {/* Botão de abrir/fechar menu apenas visível em telas menores que 'md' */}
          <button
            onClick={() => setMenuAberto(!menuAberto)}
            className="text-white hover:bg-emerald-800 p-2 rounded-lg md:hidden focus:outline-none cursor-pointer"
          >
            {menuAberto ? <X size={28} /> : <Menu size={28} />}
          </button>

          <img
            src="/img/logo 2.png"
            alt="logoLuana"
            className="hidden sm:block w-[50px] h-[50px] object-contain"
          />
        </div>

        {/* LINKS DO MEIO: CENTRALIZADOS ABSOLUTAMENTE NO DESKTOP */}
        {/* O hidden md:flex faz desaparecer no mobile para não amassar a tela */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center text-xl text-white font-medium">
          <Link
            to="/"
            className="mx-4 hover:underline decoration-2 decoration-green-400 underline-offset-4 hover:text-green-400"
          >
            Home
          </Link>

          <Link
            to="/"
            className="mx-4 hover:underline decoration-2 decoration-green-400 underline-offset-4 hover:text-green-400"
          >
            Sobre
          </Link>

          <Link
            to="/Feedback"
            className="mx-4 hover:underline decoration-2 decoration-green-400 underline-offset-4 hover:text-green-400"
          >
            Feedback
          </Link>

          <Link
            to="/"
            className="mx-4 hover:underline decoration-2 decoration-green-400 underline-offset-4 hover:text-green-400"
          >
            Contatos
          </Link>
        </div>

        {/* LADO DIREITO: BOTÕES (DESKTOP) E MENU DO USUÁRIO */}
        <div className="z-10 flex items-center gap-4 pr-2">
          {/* Botões escondidos no mobile com 'hidden md:flex' */}
          {!usuario ? (
            <div className="hidden xl:flex items-center gap-3">
              <Link to="/CadPa">
                <button className="cursor-pointer bg-[#2fa84a] hover:bg-[#278d3e] px-16 py-2 rounded-full text-base font-bold text-white transition-colors shadow-md min-w-[160px]">
                  Criar Conta
                </button>
              </Link>

              <Link to="/LoginPa">
                <button className="cursor-pointer bg-transparent border-2 border-white hover:bg-white/10 px-16 py-2 rounded-full text-base font-bold text-white transition-colors min-w-[160px]">
                  Entrar
                </button>
              </Link>
            </div>
          ) : (
            /* Menu Dropdown do Perfil permanece sempre visível na ponta */
            <USERH_Menu
              icone={
                <CircleUserRoundIcon
                  className="cursor-pointer hover:opacity-80 transition-opacity"
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

              {/* Botão de sair abre o popup de confirmação */}
              <button
                type="button"
                onClick={() => setMostrarLogout(true)}
                className="p-5 flex justify-center hover:bg-slate-200 rounded-xl w-full text-left cursor-pointer"
              >
                SAIR
              </button>
            </USERH_Menu>
          )}
        </div>

        {/* PAINEL MOBILE: APARECE APENAS QUANDO O MENU ESTÁ ABERTO EM TELAS PEQUENAS */}
        {menuAberto && (
          <div className="absolute top-20 left-0 w-full bg-emerald-950 flex flex-col md:hidden text-white shadow-2xl p-5 gap-4 z-50 border-t border-emerald-800 animate-in fade-in slide-in-from-top-5 duration-200">
            <Link
              to="/"
              onClick={() => setMenuAberto(false)}
              className="text-lg hover:text-green-400 py-1 border-b border-emerald-900"
            >
              Home
            </Link>

            <Link
              to="/"
              onClick={() => setMenuAberto(false)}
              className="text-lg hover:text-green-400 py-1 border-b border-emerald-900"
            >
              Sobre
            </Link>

            <Link
              to="/Feedback"
              onClick={() => setMenuAberto(false)}
              className="text-lg hover:text-green-400 py-1 border-b border-emerald-900"
            >
              Feedback
            </Link>

            <Link
              to="/"
              onClick={() => setMenuAberto(false)}
              className="text-lg hover:text-green-400 py-1 border-b border-emerald-900"
            >
              Contatos
            </Link>

            {/* Botões mobile adaptados para ocupar 100% da largura horizontal */}
            {!usuario ? (
              <div className="flex flex-col gap-3 mt-2">
                <Link to="/CadPa" onClick={() => setMenuAberto(false)}>
                  <button className="w-full bg-[#2fa84a] py-3 rounded-full text-base font-bold text-white shadow-md">
                    Criar Conta
                  </button>
                </Link>

                <Link to="/LoginPa" onClick={() => setMenuAberto(false)}>
                  <button className="w-full bg-transparent border-2 border-white py-3 rounded-full text-base font-bold text-white">
                    Entrar
                  </button>
                </Link>
              </div>
            ) : (
              /* Menu do usuário no mobile */
              <div className="flex flex-col gap-2 mt-2">
                <Link
                  to="/User"
                  onClick={() => setMenuAberto(false)}
                  className="text-lg hover:text-green-400 py-2 border-b border-emerald-900"
                >
                  PERFIL
                </Link>

                <Link
                  to="/User"
                  onClick={() => setMenuAberto(false)}
                  className="text-lg hover:text-green-400 py-2 border-b border-emerald-900"
                >
                  AGENDAMENTO
                </Link>

                <Link
                  to="/User"
                  onClick={() => setMenuAberto(false)}
                  className="text-lg hover:text-green-400 py-2 border-b border-emerald-900"
                >
                  AGENDAR CONSULTA
                </Link>

                <Link
                  to="/User"
                  onClick={() => setMenuAberto(false)}
                  className="text-lg hover:text-green-400 py-2 border-b border-emerald-900"
                >
                  CONSULTA
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setMenuAberto(false);
                    setMostrarLogout(true);
                  }}
                  className="text-lg text-left hover:text-green-400 py-2"
                >
                  SAIR
                </button>
              </div>
            )}
          </div>
        )}
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
