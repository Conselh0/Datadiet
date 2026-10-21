import {
  CalendarDays,
  CalendarRange,
  ChartNoAxesCombined,
  ChevronRight,
  ClipboardList,
  LogOut,
  Menu,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useNutricionista from "../hooks/useNutricionista";
import { sair } from "../utils/sessao";
import { iniciais } from "../utils/formatters";

const links = [
  { to: "/Admin", label: "Dashboard", icon: ChartNoAxesCombined, end: true },
  { to: "/Admin/Perfil", label: "Meu perfil", icon: UserRound },
  {
    to: "/Admin/Agenda",
    label: "Agenda",
    icon: CalendarRange,
  },
  { to: "/Admin/Pacientes", label: "Pacientes", icon: UsersRound },
  { to: "/Admin/Agendamentos", label: "Agendamentos", icon: CalendarDays },
  { to: "/Admin/Historico", label: "Histórico", icon: ClipboardList },
];

function SidebarAdmin() {
  const [menuAberto, setMenuAberto] = useState(false);
  const { nutricionista, carregando } = useNutricionista();
  const navigate = useNavigate();

  function encerrarSessao() {
    sair();
    navigate("/");
  }

  return (
    <aside className="relative z-30 w-full shrink-0 bg-gray-800 text-white lg:sticky lg:top-0 lg:h-screen lg:w-72">
      <div className="flex min-h-20 items-center justify-between border-b border-white/10 px-5 lg:min-h-0 lg:flex-col lg:items-stretch lg:border-0 lg:px-5 lg:pb-5 lg:pt-8">
        <div className="flex items-center gap-3">
          <img
            src="/img/DataDiet.png"
            alt="DataDiet"
            className="h-10 w-10 rounded-xl bg-white object-contain p-1"
          />
          <div>
            <p className="text-lg font-bold leading-tight tracking-wide">
              DataDiet
            </p>
            <p className="text-xs text-gray-400">Painel profissional</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMenuAberto((aberto) => !aberto)}
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuAberto}
          className="rounded-xl p-2 text-gray-300 transition hover:bg-white/10 hover:text-white lg:hidden"
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
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-gray-400 bg-gray-700 text-sm font-bold">
            {nutricionista ? iniciais(nutricionista.nome) : "ND"}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              {carregando ? "Carregando..." : nutricionista?.nome || "Nutricionista"}
            </p>
            <p className="mt-0.5 truncate text-xs text-gray-400">
              {nutricionista
                ? `CRN ${nutricionista.crn}`
                : "Painel profissional"}
            </p>
          </div>
        </div>
      </div>

      <nav
        aria-label="Navegação administrativa"
        className={`${menuAberto ? "block" : "hidden"} absolute left-0 right-0 top-full border-t border-white/10 bg-gray-800 px-3 pb-4 pt-3 lg:static lg:block lg:border-0 lg:px-3 lg:pb-5 lg:pt-8`}
      >
        <p className="px-3 pb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">
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
                      ? "bg-white text-gray-800 shadow-lg shadow-black/10"
                      : "text-gray-300 hover:bg-white/[0.08] hover:text-white"
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
          <button
            type="button"
            onClick={encerrarSessao}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-gray-400 transition hover:bg-white/[0.08] hover:text-white"
          >
            <LogOut size={19} strokeWidth={1.9} aria-hidden="true" />
            Sair da conta
          </button>
        </div>
      </nav>
    </aside>
  );
}

export default SidebarAdmin;
