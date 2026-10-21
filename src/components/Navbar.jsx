import { useEffect, useState } from "react";
import { Menu, X, LogOut, CalendarDays, ChevronRight } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import USERH_Menu from "./USERH_Menu";
import { getSessao, sair } from "../utils/sessao";
import { buscarNutricionista } from "../services/nutricionistaService";

// Itens do menu do usuário: cada tipo de conta tem os seus
const MENU_PACIENTE = [
  ["PERFIL", "/User"],
  ["HISTORICO", "/User/Historico"],
  ["AGENDAR CONSULTA", "/User/Agendamentos"],
];

const MENU_NUTRICIONISTA = [
  ["PERFIL", "/Admin"],
  ["HISTÓRICO", "/Admin/Historico"],
  ["PACIENTES", "/Admin/Pacientes"],
];

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuAberto, setMenuAberto] = useState(false);

  // Usuário logado (paciente ou nutricionista)
  const [usuario, setUsuario] = useState(null);

  // Controla o popup de logout
  const [mostrarLogout, setMostrarLogout] = useState(false);

  // Mantém os dados de login e a foto do perfil sincronizados.
  useEffect(() => {
    let ativo = true;

    function sincronizarUsuario() {
      const usuarioAtual = getSessao();
      setUsuario(usuarioAtual);

      if (usuarioAtual?.tipo === "paciente" && usuarioAtual.id) {
        fetch(`http://localhost:8080/perfil/${usuarioAtual.id}`)
          .then((resposta) => {
            if (!resposta.ok) {
              throw new Error("Não foi possível carregar a foto do perfil.");
            }

            return resposta.json();
          })
          .then((perfil) => {
            if (!ativo) return;

            const fotoPerfil = perfil.fotoPerfil || "";
            const usuarioSalvoAtualizado = getSessao();

            if (
              usuarioSalvoAtualizado?.id === usuarioAtual.id &&
              usuarioSalvoAtualizado.tipo === "paciente"
            ) {
              localStorage.setItem(
                "usuario",
                JSON.stringify({ ...usuarioSalvoAtualizado, fotoPerfil }),
              );
            }

            setUsuario((usuarioMaisRecente) => {
              if (
                !usuarioMaisRecente ||
                usuarioMaisRecente.id !== usuarioAtual.id ||
                usuarioMaisRecente.tipo !== "paciente"
              ) {
                return usuarioMaisRecente;
              }

              return { ...usuarioMaisRecente, fotoPerfil };
            });
          })
          .catch((error) => {
            if (ativo) console.error("Erro ao carregar foto do perfil:", error);
          });
      }

      if (
        usuarioAtual?.tipo === "nutricionista" &&
        (usuarioAtual.id || usuarioAtual._id)
      ) {
        const idNutricionista = usuarioAtual.id || usuarioAtual._id;
        buscarNutricionista(idNutricionista)
          .then((perfil) => {
            if (!ativo) return;

            const sessaoAtual = getSessao();
            if (
              sessaoAtual?.tipo === "nutricionista" &&
              (sessaoAtual.id || sessaoAtual._id) === idNutricionista
            ) {
              const sessaoAtualizada = {
                ...sessaoAtual,
                nome: perfil.nome,
                foto: perfil.foto || "",
              };
              localStorage.setItem("usuario", JSON.stringify(sessaoAtualizada));
              setUsuario(sessaoAtualizada);
            }
          })
          .catch((error) => {
            if (ativo) {
              console.error("Erro ao carregar a foto da nutricionista:", error);
            }
          });
      }
    }

    function sincronizarFotoPerfil(evento) {
      const novaFoto = evento?.detail?.fotoPerfil;

      if (typeof novaFoto === "string" && ativo) {
        setUsuario((usuarioAtual) =>
          usuarioAtual ? { ...usuarioAtual, fotoPerfil: novaFoto } : usuarioAtual,
        );
      }
    }

    function sincronizarPerfilNutricionista(evento) {
      const perfil = evento?.detail;
      if (
        !perfil ||
        getSessao()?.tipo !== "nutricionista" ||
        (getSessao()?.id || getSessao()?._id) !== perfil._id
      ) {
        return;
      }

      const sessaoAtualizada = {
        ...getSessao(),
        nome: perfil.nome,
        foto: perfil.foto || "",
      };
      localStorage.setItem("usuario", JSON.stringify(sessaoAtualizada));
      setUsuario(sessaoAtualizada);
    }

    sincronizarUsuario();
    window.addEventListener("storage", sincronizarUsuario);
    window.addEventListener("perfil-atualizado", sincronizarFotoPerfil);
    window.addEventListener(
      "nutricionista-atualizado",
      sincronizarPerfilNutricionista,
    );

    return () => {
      ativo = false;
      window.removeEventListener("storage", sincronizarUsuario);
      window.removeEventListener("perfil-atualizado", sincronizarFotoPerfil);
      window.removeEventListener(
        "nutricionista-atualizado",
        sincronizarPerfilNutricionista,
      );
    };
  }, [location.pathname]);

  const itensMenu = usuario?.tipo === "nutricionista" ? MENU_NUTRICIONISTA : MENU_PACIENTE;

  // Faz o logout
  function confirmarSaida() {
    sair();
    setUsuario(null);
    setMostrarLogout(false);
    setMenuAberto(false);

    navigate("/");
  }

  function abrirAgendamentos() {
    setMenuAberto(false);
    navigate(
      usuario?.tipo === "nutricionista"
        ? "/Admin"
        : usuario
          ? "/User/Agendamentos"
          : "/LoginPa",
    );
  }

  return (
    <>
      {/* NAVBAR */}
      <div className="font-poppins w-full bg-emerald-900 p-3 flex items-center justify-between relative shadow-md h-[4.5rem]">
        {/* LADO ESQUERDO: LOGO E BOTÃO HAMBÚRGUER MOBILE */}
        <div className="z-10 flex items-center gap-2 pl-2">
          {/* Botão de abrir/fechar menu apenas visível em telas menores que 'md' */}
          <button
            onClick={() => setMenuAberto(!menuAberto)}
            type="button"
            aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuAberto}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none md:hidden"
          >
            {menuAberto ? (
              <X size={28} />
            ) : (
              <Menu size={28} />
            )}
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
            <>
              <div className="hidden md:block">
                <USERH_Menu
                  icone={
                    <img
                      src={usuario.fotoPerfil || usuario.foto || "/img/avatar.png"}
                      alt="Abrir menu do perfil"
                      className="h-10 w-10 rounded-full border-2 border-white object-cover transition-opacity hover:opacity-80"
                    />
                  }
                >
                  <Link
                    to={usuario.tipo === "nutricionista" ? "/Admin" : "/User"}
                    className="mb-1 flex items-center gap-3 rounded-xl bg-white p-3 transition-colors hover:bg-emerald-50"
                  >
                    <img
                      src={usuario.fotoPerfil || usuario.foto || "/img/avatar.png"}
                      alt=""
                      className="h-12 w-12 rounded-full border-2 border-emerald-100 object-cover"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[11px] font-semibold uppercase tracking-wider text-emerald-700/70">
                        Conta
                      </span>
                      <span className="block truncate text-base font-bold text-emerald-950">
                        {usuario.nome || "Meu perfil"}
                      </span>
                    </span>
                    <ChevronRight size={18} className="text-emerald-700" aria-hidden="true" />
                  </Link>
                  {itensMenu.slice(1).map(([texto, rota]) => (
                    <Link
                      key={rota}
                      to={rota}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors hover:bg-white"
                    >
                      {rota === "/User/Agendamentos" ? (
                        <CalendarDays size={18} className="text-emerald-800" aria-hidden="true" />
                      ) : (
                        <ChevronRight size={18} className="text-emerald-700" aria-hidden="true" />
                      )}
                      <span className="flex-1">{texto}</span>
                      <ChevronRight size={16} className="text-emerald-700/60" aria-hidden="true" />
                    </Link>
                  ))}
                  <button
                    type="button"
                    onClick={() => setMostrarLogout(true)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-emerald-900 transition-colors hover:bg-white"
                  >
                    <LogOut size={18} className="text-emerald-800" aria-hidden="true" />
                    <span className="flex-1">Sair</span>
                  </button>
                </USERH_Menu>
              </div>
            </>
          )}
        </div>

        {/* PAINEL MOBILE: APARECE APENAS QUANDO O MENU ESTÁ ABERTO EM TELAS PEQUENAS */}
        {menuAberto && (
          <div className="absolute left-0 top-[4.5rem] z-50 flex max-h-[calc(100dvh-4.5rem)] w-full flex-col gap-4 overflow-y-auto rounded-b-3xl border-t border-white/10 bg-[#f7f5ee] px-4 py-5 text-emerald-950 shadow-2xl animate-in fade-in slide-in-from-top-3 duration-200 md:hidden">
            {usuario && (
              <Link
                to={usuario.tipo === "nutricionista" ? "/Admin" : "/User"}
                onClick={() => setMenuAberto(false)}
                className="flex items-center gap-4 rounded-2xl bg-white p-3.5 shadow-sm transition-colors hover:bg-emerald-50"
              >
                <img
                  src={usuario.fotoPerfil || usuario.foto || "/img/avatar.png"}
                  alt=""
                  className="h-12 w-12 rounded-full border-2 border-emerald-100 object-cover"
                />
                <span className="min-w-0">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-emerald-700/70">
                    Bem-vindo(a)
                  </span>
                  <span className="mt-1 block truncate text-lg font-bold text-emerald-950">
                    {usuario.nome || "Minha conta"}
                  </span>
                  <span className="text-sm font-medium text-emerald-700">
                    Ver meu perfil
                  </span>
                </span>
              </Link>
            )}

            <div>
              <p className="mb-3 px-3 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-emerald-800/70">
                Navegação
              </p>
              <nav className="flex flex-col gap-1" aria-label="Navegação principal">
                <Link
                  to="/"
                  onClick={() => setMenuAberto(false)}
                  className="rounded-xl px-3 py-2.5 text-base font-semibold transition-colors hover:bg-white"
                >
                  Home
                </Link>
                <a
                  href="/#metodo"
                  onClick={() => setMenuAberto(false)}
                  className="rounded-xl px-3 py-2.5 text-base font-semibold transition-colors hover:bg-white"
                >
                  Sobre
                </a>
                <a
                  href="/#feedback"
                  onClick={() => setMenuAberto(false)}
                  className="rounded-xl px-3 py-2.5 text-base font-semibold transition-colors hover:bg-white"
                >
                  Feedback
                </a>
                <a
                  href="/#contato"
                  onClick={() => setMenuAberto(false)}
                  className="rounded-xl px-3 py-2.5 text-base font-semibold transition-colors hover:bg-white"
                >
                  Contatos
                </a>
              </nav>
            </div>

            <button
              type="button"
              onClick={abrirAgendamentos}
              className="flex w-full items-center justify-between rounded-xl bg-emerald-900 px-3 py-3 text-left text-base font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800"
            >
              <span>Agendar consulta</span>
              <span aria-hidden="true" className="text-lg">→</span>
            </button>

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
                {itensMenu.slice(1).map(([texto, rota]) => (
                  <Link
                    key={rota}
                    to={rota}
                    onClick={() => setMenuAberto(false)}
                    className="rounded-xl px-3 py-2.5 text-base font-semibold transition-colors hover:bg-white"
                  >
                    {texto}
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setMenuAberto(false);
                    setMostrarLogout(true);
                  }}
                  className="rounded-xl px-3 py-2.5 text-left text-base font-semibold text-emerald-900 transition-colors hover:bg-white"
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
