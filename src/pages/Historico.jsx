import { useState } from "react";
import { Link } from "react-router-dom";
import { NotebookPen } from "lucide-react";
import Agendamentos from "../components/Agendamentos";
import useNutricionista from "../hooks/useNutricionista";

const FILTROS = ["Todas", "Pendente", "Confirmado", "Concluído", "Cancelado"];

function Historico() {
  const { nutricionista, carregando } = useNutricionista();
  const [filtro, setFiltro] = useState("Todas");
  const [busca, setBusca] = useState("");

  return (
    <div className="min-h-screen w-full bg-gray-100">
      <div className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-10">
        <header className="mb-8">
          <div className="mb-3 flex items-center gap-3 text-gray-700">
            <NotebookPen className="size-8 shrink-0" />
            <span className="text-sm font-semibold uppercase tracking-wider">
              Área administrativa
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl">
            Histórico de consultas
          </h1>
          <p className="mt-2 text-gray-500">
            Consulte os atendimentos e as dietas planejadas dos seus pacientes.
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
                  {FILTROS.map((f) => (
                    <button
                      key={f}
                      onClick={() => setFiltro(f)}
                      className={`cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition ${
                        filtro === f
                          ? "bg-gray-600 text-white"
                          : "bg-white text-gray-700 shadow hover:bg-gray-200"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                <input
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar por paciente ou nº"
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

export default Historico;
