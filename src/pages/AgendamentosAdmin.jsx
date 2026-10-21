import { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import Agendamentos from "../components/Agendamentos";
import useNutricionista from "../hooks/useNutricionista";

const FILTROS = [
  { valor: "Pendente", rotulo: "Pendentes" },
  { valor: "Confirmado", rotulo: "Confirmadas" },
  { valor: "Concluído", rotulo: "Concluídas" },
  { valor: "Cancelado", rotulo: "Canceladas" },
];

function AgendamentosAdmin() {
  const { nutricionista, carregando } = useNutricionista();
  const [filtro, setFiltro] = useState(FILTROS[0].valor);
  const [busca, setBusca] = useState("");

  return (
    <div className="min-h-screen w-full bg-gray-100">
      <div className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-10">
        <header className="mb-8">
          <div className="mb-3 flex items-center gap-3 text-gray-700">
            <CalendarDays className="size-8 shrink-0" />
            <span className="text-sm font-semibold uppercase tracking-wider">
              Área administrativa
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl">
            Agendamentos
          </h1>
          <p className="mt-2 text-gray-500">
            Gerencie os atendimentos e solicitações dos seus pacientes.
          </p>
        </header>

        {!carregando && !nutricionista && (
          <div className="rounded-2xl bg-yellow-100 p-4 text-yellow-900">
            Nenhum nutricionista identificado.{" "}
            <Link to="/LoginPa" className="font-bold underline">
              Entrar
            </Link>
          </div>
        )}

        {nutricionista && (
          <>
            <div className="mb-5 flex flex-col gap-4 rounded-3xl bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-wrap gap-2">
                {FILTROS.map((opcao) => (
                  <button
                    key={opcao.valor}
                    type="button"
                    onClick={() => setFiltro(opcao.valor)}
                    className={`cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition ${
                      filtro === opcao.valor
                        ? "bg-gray-600 text-white"
                        : "bg-white text-gray-700 shadow hover:bg-gray-200"
                    }`}
                  >
                    {opcao.rotulo}
                  </button>
                ))}
              </div>

              <input
                type="search"
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
                placeholder="Buscar por paciente ou nº"
                aria-label="Buscar agendamentos por paciente ou número"
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-gray-700 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-200 sm:w-72"
              />
            </div>

            <Agendamentos
              nutricionistaId={nutricionista._id}
              status={filtro}
              busca={busca}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default AgendamentosAdmin;
