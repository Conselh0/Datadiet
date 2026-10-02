import { useEffect, useState } from "react";
import {
  criarAgendamento,
  buscarHorariosOcupados,
  getUsuario,
} from "../services/agendamentoService";

// AJUSTE AQUI: lista de nutricionistas (ou busque do seu backend)
const NUTRICIONISTAS = ["Ana Clara", "Carlos Mendes", "Beatriz Lima"];

// Horários de 08:00 a 17:30, de 30 em 30 minutos
const HORARIOS = Array.from({ length: 20 }, (_, i) => {
  const h = String(8 + Math.floor(i / 2)).padStart(2, "0");
  return `${h}:${i % 2 ? "30" : "00"}`;
});

const hoje = () => new Date().toLocaleDateString("sv-SE"); // AAAA-MM-DD

function FormAgendamento({ onSucesso }) {
  const usuario = getUsuario();
  const [nutricionista, setNutricionista] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [ocupados, setOcupados] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const [msg, setMsg] = useState({ tipo: "", texto: "" });

  useEffect(() => {
    setHorario("");
    if (nutricionista && data) {
      buscarHorariosOcupados(nutricionista, data)
        .then(setOcupados)
        .catch(() => setOcupados([]));
    } else {
      setOcupados([]);
    }
  }, [nutricionista, data]);

  // Esconde horários que já passaram quando a data é hoje
  const passou = (h) =>
    data === hoje() &&
    h <= new Date().toLocaleTimeString("sv-SE").slice(0, 5);

  const enviar = async (e) => {
    e.preventDefault();
    setMsg({ tipo: "", texto: "" });
    if (!nutricionista || !data || !horario) {
      return setMsg({ tipo: "erro", texto: "Escolha nutricionista, data e horário." });
    }
    try {
      setEnviando(true);
      await criarAgendamento({
        paciente: usuario.nome || "Paciente",
        pacienteId: usuario.id,
        nutricionista,
        data,
        horario,
      });
      setMsg({ tipo: "ok", texto: "Consulta agendada com sucesso!" });
      setHorario("");
      setOcupados((o) => [...o, horario]);
      onSucesso?.();
    } catch (err) {
      setMsg({ tipo: "erro", texto: err.message });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form
      onSubmit={enviar}
      className="w-full max-w-2xl rounded-2xl bg-green-950 p-5 md:p-8 text-white shadow-xl"
    >
      <h2 className="mb-5 text-xl md:text-2xl font-bold">Agende sua consulta</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm font-semibold">
          Nutricionista
          <select
            value={nutricionista}
            onChange={(e) => setNutricionista(e.target.value)}
            className="rounded-lg bg-white p-3 font-normal text-slate-800"
          >
            <option value="">Selecione</option>
            {NUTRICIONISTAS.map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm font-semibold">
          Data
          <input
            type="date"
            min={hoje()}
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="rounded-lg bg-white p-3 font-normal text-slate-800"
          />
        </label>
      </div>

      <p className="mt-5 mb-2 text-sm font-semibold">Horário</p>
      {!nutricionista || !data ? (
        <p className="text-sm text-green-200">
          Escolha o nutricionista e a data para ver os horários livres.
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
          {HORARIOS.map((h) => {
            const indisponivel = ocupados.includes(h) || passou(h);
            const ativo = horario === h;
            return (
              <button
                type="button"
                key={h}
                disabled={indisponivel}
                onClick={() => setHorario(h)}
                className={`rounded-lg p-2 text-sm font-semibold transition ${
                  ativo
                    ? "bg-green-400 text-green-950"
                    : "bg-white text-slate-800 hover:bg-green-100"
                } disabled:cursor-not-allowed disabled:bg-green-900 disabled:text-green-700 disabled:line-through`}
              >
                {h}
              </button>
            );
          })}
        </div>
      )}

      {msg.texto && (
        <p
          className={`mt-4 rounded-md p-3 text-sm font-semibold ${
            msg.tipo === "ok" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"
          }`}
        >
          {msg.texto}
        </p>
      )}

      <button
        disabled={enviando}
        className="mt-6 w-full rounded-lg bg-green-400 p-3 font-bold text-green-950 hover:bg-green-300 disabled:opacity-60"
      >
        {enviando ? "Agendando..." : "Confirmar agendamento"}
      </button>
    </form>
  );
}

export default FormAgendamento;
