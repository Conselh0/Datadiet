import { useState } from "react";
import { Link } from "react-router-dom";
import { NotebookPen } from "lucide-react";
import Agendamentos from "../components/Agendamentos";
import useNutricionista from "../hooks/useNutricionista";

function Historico() {
  const { nutricionista, carregando } = useNutricionista();
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
            Consulte os atendimentos concluídos dos seus pacientes.
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
            <div className="mb-5 rounded-3xl bg-white p-5 shadow-sm sm:p-6">
              <input
                type="search"
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
                placeholder="Buscar por paciente ou nº"
                aria-label="Buscar consultas concluídas por paciente ou número"
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-gray-700 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-200 sm:w-72"
              />
            </div>

            <Agendamentos
              nutricionistaId={nutricionista._id}
              status="Concluído"
              busca={busca}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default Historico;
