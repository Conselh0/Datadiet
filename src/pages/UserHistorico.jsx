import { RotateCcwClockIcon } from "lucide-react";
import HistoricoConsultas from "../components/HistoricoConsultas";

function UserHistorico() {
  return (
    <div className="min-h-full p-4 sm:p-8">
      <section className="overflow-hidden rounded-3xl border border-gray-200 bg-gray-200 shadow-xl shadow-gray-900/5">
        <header className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-green-900 to-emerald-800 px-5 py-7 text-white sm:px-8 sm:py-9">
          <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full border-[32px] border-white/[0.06]" />
          <div className="relative flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
              <RotateCcwClockIcon size={30} aria-hidden="true" />
            </span>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-green-100">
                Área do paciente
              </p>
              <h1 className="text-2xl font-bold sm:text-3xl">
                Histórico de consultas
              </h1>
              <p className="mt-2 text-sm text-green-100/80">
                Consulte suas consultas e solicitações.
              </p>
            </div>
          </div>
        </header>
        <div className="p-5 sm:p-8">
          <HistoricoConsultas />
        </div>
      </section>
    </div>
  );
}

export default UserHistorico;
