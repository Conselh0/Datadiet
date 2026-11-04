import {
  CalendarDays,
  ChevronRight,
  ClipboardList,
  CalendarCheck,
  House,
  Menu,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { getSessao } from "../utils/sessao";

const API = import.meta.env.VITE_API_URL;

const links = [
  { to: "/User", label: "Meu perfil", icon: UserRound, end: true },
  { to: "/User/MinhaConsulta", label: "Minha consulta", icon: CalendarCheck },
  { to: "/User/Historico", label: "Histórico", icon: ClipboardList },
  { to: "/User/Agendamentos", label: "Agendar consulta", icon: CalendarDays },
];

function SidebarUser() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [usuario, setUsuario] = useState(() => getSessao());

  useEffect(() => {
    let ativo = true;

    function sincronizarSessao() {
      setUsuario(getSessao());
    }

    function sincronizarFotoPerfil(evento) {
      const { fotoPerfil, nome, sobrenome, email } = evento?.detail || {};
      if (
        typeof fotoPerfil !== "string" &&
        typeof nome !== "string" &&
        typeof sobrenome !== "string" &&
        typeof email !== "string"
      ) {
        return;
      }

      setUsuario((atual) =>
        atual
          ? {
              ...atual,
              ...(typeof nome === "string" && { nome }),
              ...(typeof email === "string" && { email }),
              ...(typeof fotoPerfil === "string" && { fotoPerfil }),
            }
          : atual,
      );
    }

    const idUsuario = usuario?.id || usuario?._id;
    if (idUsuario && usuario?.tipo === "paciente") {
      fetch(`${API}/perfil/${idUsuario}`)
        .then(async (resposta) => {
          const dados = await resposta.json().catch(() => ({}));
          if (!resposta.ok) {
            throw new Error(dados.erro || "Não foi possível carregar o perfil.");
          }
          return dados;
        })
        .then((perfil) => {
          if (!ativo) return;
          const sessaoAtual = getSessao();
          if (
            sessaoAtual?.tipo === "paciente" &&
            (sessaoAtual.id || sessaoAtual._id) === idUsuario
          ) {
            setUsuario({
              ...sessaoAtual,
              nome: [perfil.nome, perfil.sobrenome].filter(Boolean).join(" "),
              sobrenome: perfil.sobrenome || "",
              fotoPerfil: perfil.fotoPerfil || "",
            });
          }
        })
        .catch((error) => {
          if (ativo) console.error("Erro ao carregar perfil do paciente:", error);
        });
    }

    window.addEventListener("storage", sincronizarSessao);
    window.addEventListener("perfil-atualizado", sincronizarFotoPerfil);

    return () => {
      ativo = false;
      window.removeEventListener("storage", sincronizarSessao);
      window.removeEventListener("perfil-atualizado", sincronizarFotoPerfil);
    };
  }, [usuario?.id, usuario?._id, usuario?.tipo]);

  const nomeUsuario = usuario?.nome || "Paciente";
  const iniciais = nomeUsuario
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0].toUpperCase())
    .join("");

  return (
    <aside className="relative z-30 w-full shrink-0 bg-emerald-900 text-white lg:sticky lg:top-0 lg:h-screen lg:w-72">
      <div className="flex min-h-20 items-center justify-between border-b border-white/10 px-5 lg:min-h-0 lg:flex-col lg:items-stretch lg:border-0 lg:px-5 lg:pb-5 lg:pt-8">
        <Link
          to="/"
          aria-label="DataDiet - página inicial"
          className="flex items-center gap-3"
        >
          <img
            src="/img/DataDiet.png"
            alt=""
            className="h-10 w-10 rounded-xl bg-white object-contain p-1"
          />
          <div>
            <p className="text-lg font-bold leading-tight tracking-wide">
              DataDiet
            </p>
            <p className="text-xs text-emerald-100/70">Painel do paciente</p>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setMenuAberto((aberto) => !aberto)}
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuAberto}
          className="rounded-xl p-2 text-emerald-100 transition hover:bg-white/10 hover:text-white lg:hidden"
        >
          {menuAberto ? (
            <X size={23} aria-hidden="true" />
          ) : (
            <Menu size={23} aria-hidden="true" />
          )}
        </button>
      </div>

      <div className="hidden px-5 pt-3 lg:block">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4">
          {usuario?.fotoPerfil ? (
            <img
              src={usuario.fotoPerfil}
              alt={`Foto de ${nomeUsuario}`}
              className="h-12 w-12 shrink-0 rounded-full border-2 border-emerald-200 object-cover"
            />
          ) : (
            <div
              aria-hidden="true"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-emerald-200 bg-emerald-800 text-sm font-bold"
            >
              {iniciais}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{nomeUsuario}</p>
            <p className="mt-0.5 truncate text-xs text-emerald-100/70">Paciente</p>
          </div>
        </div>
      </div>

      <nav
        aria-label="Navegação do paciente"
        className={`${menuAberto ? "block" : "hidden"} absolute left-0 right-0 top-full border-t border-white/10 bg-emerald-900 px-3 pb-4 pt-3 lg:static lg:block lg:border-0 lg:px-3 lg:pb-5 lg:pt-8`}
      >
        <p className="px-3 pb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-100/60">
          Menu principal
        </p>
        <ul className="space-y-1.5">
          {links.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                onClick={() => setMenuAberto(false)}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-white text-emerald-950 shadow-lg shadow-black/10"
                      : "text-emerald-50/90 hover:bg-white/[0.08] hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={19} strokeWidth={1.9} aria-hidden="true" />
                    <span className="flex-1">{label}</span>
                    {isActive && (
                      <ChevronRight size={16} aria-hidden="true" />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="mt-6 border-t border-white/10 pt-4">
          <NavLink
            to="/"
            onClick={() => setMenuAberto(false)}
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-emerald-100/70 transition hover:bg-white/[0.08] hover:text-white"
          >
            <House size={19} strokeWidth={1.9} aria-hidden="true" />
            Menu principal
          </NavLink>
        </div>
      </nav>
    </aside>
  );
}

export default SidebarUser;
