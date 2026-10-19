import { CalendarDays } from "lucide-react";
import { useLocation } from "react-router-dom";
import CalendarioConsultas from "../components/CalendarioConsultas";

function Calendario() {
  const location = useLocation();
  const dataInicial = location.state?.data;

  return (
    <main className="min-h-screen w-full bg-gray-100 p-4 sm:p-6 lg:p-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
            <CalendarDays size={17} aria-hidden="true" />
            Agenda profissional
          </div>
          <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl">
            Agenda
          </h1>
          <p className="mt-2 text-gray-500">
            Consulte os atendimentos por dia e navegue entre os meses.
          </p>
        </header>

        <CalendarioConsultas
          dataInicial={dataInicial}
          expandido
          className="p-5 sm:p-8"
        />
      </div>
    </main>
  );
}

export default Calendario;
