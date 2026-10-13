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
    <div className="w-full min-h-screen bg-gray-100">
      <div className="w-full p-4 lg:p-10">
        <div className="max-w-5xl">
          <h1 className="mb-6 flex items-center gap-3 text-2xl font-bold text-gray-800 lg:text-3xl">
            <NotebookPen className="size-9 shrink-0" />
            HISTÓRICO DE CONSULTAS E DIETAS PLANEJADAS
          </h1>

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
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2">
                  {FILTROS.map((f) => (
                    <button
                      key={f}
                      onClick={() => setFiltro(f)}
                      className={`cursor-pointer rounded-full px-4 py-1 text-sm font-semibold transition ${
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
                  className="h-10 w-full rounded-lg bg-white px-3 shadow sm:w-64"
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
    </div>
  );
}

export default Historico;
