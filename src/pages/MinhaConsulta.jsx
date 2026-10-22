import { CalendarCheck } from "lucide-react";
import ProximaConsulta from "../components/ProximaConsulta";

function MinhaConsulta() {
  return (
    <div className="min-h-full bg-gray-50/70 p-4 sm:p-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex items-start gap-4 px-1 sm:mb-8 sm:px-2">
          <span className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-white text-emerald-800 shadow-sm">
                <CalendarCheck size={24} strokeWidth={1.8} aria-hidden="true" />
            </span>
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">
                Área do paciente
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Minha consulta
            </h1>
            <p className="mt-2 text-sm text-gray-600 sm:text-base">
                Acompanhe seu próximo atendimento e gerencie suas solicitações.
            </p>
          </div>
        </header>
        <ProximaConsulta />
      </div>
    </div>
  );
}

export default MinhaConsulta;
