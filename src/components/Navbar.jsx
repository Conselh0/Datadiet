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
            type="button"
            aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuAberto}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none md:hidden"
          >
            {menuAberto ? <X size={28} /> : <Menu size={28} />}
          </button>

          <Link to="/" aria-label="Voltar para a página inicial">
            <img
              src="/img/logo 2.png"
              alt="Luana Teixeira - página inicial"
              className="block h-10 w-10 object-contain sm:h-[50px] sm:w-[50px]"
            />
          </Link>
        </div>

        {!usuario && (
          <Link
            to="/LoginPa"
            className="absolute right-5 text-sm font-semibold text-white underline-offset-4 transition-colors hover:text-green-200 hover:underline md:hidden"
          >
            Entrar / Criar Conta
          </Link>
        )}

        {/* LINKS DO MEIO: CENTRALIZADOS ABSOLUTAMENTE NO DESKTOP */}
        {/* O hidden md:flex faz desaparecer no mobile para não amassar a tela */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center text-xl text-white font-medium">
          <Link
            to="/"
            className="mx-4 hover:underline decoration-2 decoration-green-400 underline-offset-4 hover:text-green-400"
          >
            Home
          </Link>

          <a
            href="/#metodo"
            className="mx-4 hover:underline decoration-2 decoration-green-400 underline-offset-4 hover:text-green-400"
          >
            Sobre
          </a>

          <a
            href="/#feedback"
            className="mx-4 hover:underline decoration-2 decoration-green-400 underline-offset-4 hover:text-green-400"
          >
            Feedback
          </a>

          <a
            href="/#contato"
            className="mx-4 hover:underline decoration-2 decoration-green-400 underline-offset-4 hover:text-green-400"
          >
            Contatos
          </a>
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
          <div className="absolute left-0 top-20 z-50 flex max-h-[calc(100dvh-5rem)] w-full flex-col gap-5 overflow-y-auto rounded-b-3xl border-t border-white/10 bg-[#f3f0e9] px-5 py-6 text-emerald-950 shadow-2xl animate-in fade-in slide-in-from-top-3 duration-200 md:hidden">
            <div>
              <p className="mb-3 px-3 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-emerald-800/70">
                Navegação
              </p>
              <nav className="flex flex-col gap-1" aria-label="Navegação principal">
                <Link
                  to="/"
                  onClick={() => setMenuAberto(false)}
                  className="rounded-xl px-3 py-3 text-base font-medium transition-colors hover:bg-emerald-900/10"
                >
                  Home
                </Link>
                <a
                  href="/#metodo"
                  onClick={() => setMenuAberto(false)}
                  className="rounded-xl px-3 py-3 text-base font-medium transition-colors hover:bg-emerald-900/10"
                >
                  Sobre
                </a>
                <a
                  href="/#feedback"
                  onClick={() => setMenuAberto(false)}
                  className="rounded-xl px-3 py-3 text-base font-medium transition-colors hover:bg-emerald-900/10"
                >
                  Feedback
                </a>
                <a
                  href="/#contato"
                  onClick={() => setMenuAberto(false)}
                  className="rounded-xl px-3 py-3 text-base font-medium transition-colors hover:bg-emerald-900/10"
                >
                  Contatos
                </a>
              </nav>
            </div>

            {!usuario ? (
              <div className="flex flex-col gap-3 border-t border-emerald-900/10 pt-5">
                <Link to="/CadPa" onClick={() => setMenuAberto(false)}>
                  <span className="block w-full rounded-full bg-green-700 py-3 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-800">
                    Criar conta
                  </span>
                </Link>
                <Link to="/LoginPa" onClick={() => setMenuAberto(false)}>
                  <span className="block w-full rounded-full border border-emerald-900 px-4 py-3 text-center text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-900/5">
                    Entrar
                  </span>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-1 border-t border-emerald-900/10 pt-5">
                <Link
                  to="/User"
                  onClick={() => setMenuAberto(false)}
                  className="rounded-xl px-3 py-3 text-base font-medium transition-colors hover:bg-emerald-900/10"
                >
                  Perfil
                </Link>
                <Link
                  to="/User/Agendamentos"
                  onClick={() => setMenuAberto(false)}
                  className="rounded-xl px-3 py-3 text-base font-medium transition-colors hover:bg-emerald-900/10"
                >
                  Meus agendamentos
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMenuAberto(false);
                    setMostrarLogout(true);
                  }}
                  className="rounded-xl px-3 py-3 text-left text-base font-medium text-emerald-900 transition-colors hover:bg-emerald-900/10"
                >
                  Sair
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
