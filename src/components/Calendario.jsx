import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const pad = (n) => String(n).padStart(2, "0");

// value: "AAAA-MM-DD" | onChange(dataIso) | diasAtendimento: [0..6]
function Calendario({ value, onChange, diasAtendimento = [0, 1, 2, 3, 4, 5, 6] }) {
  const hoje = new Date();
  const hojeIso = hoje.toLocaleDateString("sv-SE");
  const [mes, setMes] = useState(hoje.getMonth());
  const [ano, setAno] = useState(hoje.getFullYear());

  const primeiroDia = new Date(ano, mes, 1).getDay();
  const totalDias = new Date(ano, mes + 1, 0).getDate();
  const titulo = new Date(ano, mes, 1).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  const naoPodeVoltar = ano === hoje.getFullYear() && mes === hoje.getMonth();

  const mudarMes = (delta) => {
    const nova = new Date(ano, mes + delta, 1);
    setMes(nova.getMonth());
    setAno(nova.getFullYear());
  };

  const celulas = [
    ...Array(primeiroDia).fill(null),
    ...Array.from({ length: totalDias }, (_, i) => i + 1),
  ];

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => mudarMes(-1)}
          disabled={naoPodeVoltar}
          aria-label="Mês anterior"
          className="rounded-full p-2 text-green-900 hover:bg-green-100 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ChevronLeft />
        </button>
        <p className="text-lg font-bold capitalize text-green-950">{titulo}</p>
        <button
          type="button"
          onClick={() => mudarMes(1)}
          aria-label="Próximo mês"
          className="rounded-full p-2 text-green-900 hover:bg-green-100"
        >
          <ChevronRight />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {SEMANA.map((d) => (
          <span key={d} className="pb-2 text-xs font-semibold text-green-700">
            {d}
          </span>
        ))}

        {celulas.map((dia, i) => {
          if (!dia) return <span key={`v${i}`} />;

          const iso = `${ano}-${pad(mes + 1)}-${pad(dia)}`;
          const dow = new Date(ano, mes, dia).getDay();
          const disponivel = iso >= hojeIso && diasAtendimento.includes(dow);
          const selecionado = iso === value;

          return (
            <button
              type="button"
              key={iso}
              disabled={!disponivel}
              onClick={() => onChange(iso)}
              className={`aspect-square rounded-full text-sm transition ${
                selecionado
                  ? "bg-green-700 font-bold text-white shadow-md"
                  : disponivel
                  ? "bg-green-50 font-semibold text-green-900 hover:bg-green-200"
                  : "cursor-not-allowed text-gray-300"
              } ${iso === hojeIso && !selecionado ? "ring-2 ring-green-400" : ""}`}
            >
              {dia}
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-center text-xs text-gray-500">
        Dias em verde têm horários disponíveis.
      </p>
    </div>
  );
}

export default Calendario;
