import { useEffect, useState } from "react";
import StatusBadge from "./StatusBadge";
import {
  listarAgendamentos,
  atualizarStatus,
  getUsuario,
} from "../services/agendamentoService";
import { formatarData } from "../utils/formatters";

const FILTROS = ["Todas", "Pendente", "Confirmado", "Concluído", "Cancelado"];

function HistoricoConsultas() {
  const [lista, setLista] = useState([]);
  const [filtro, setFiltro] = useState("Todas");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const carregar = async () => {
    try {
      setErro("");
      const { id } = getUsuario();
      setLista(await listarAgendamentos({ pacienteId: id }));
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const cancelar = async (id) => {
    if (!window.confirm("Deseja cancelar esta consulta?")) return;
    try {
      await atualizarStatus(id, "Cancelado");
      carregar();
    } catch (e) {
      setErro(e.message);
    }
  };

  const visiveis =
    filtro === "Todas" ? lista : lista.filter((a) => a.status === filtro);

  return (
    <section className="w-full">
      <h2 className="mb-4 text-xl md:text-2xl font-bold text-green-950">
        Histórico de consultas
      </h2>

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTROS.map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`rounded-full px-4 py-1 text-sm font-semibold transition ${
              filtro === f
                ? "bg-green-900 text-white"
                : "bg-white text-green-900 border border-green-900 hover:bg-green-50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {erro && (
        <p className="mb-3 rounded-md bg-red-100 p-3 text-red-700">{erro}</p>
      )}
      {carregando && <p className="text-gray-600">Carregando consultas...</p>}
      {!carregando && visiveis.length === 0 && (
        <p className="rounded-xl bg-white p-8 text-center text-gray-600 shadow">
          Nenhuma consulta encontrada nesse filtro.
        </p>
      )}

      <ul className="space-y-3">
        {visiveis.map((a) => {
          const podeCancelar = ["Pendente", "Confirmado"].includes(a.status);
          return (
            <li
              key={a._id}
              className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-xs font-bold text-gray-500">
                  Atendimento #{a.numero}
                </p>
                <p className="text-lg font-bold text-slate-800">
                  {formatarData(a.data)} às {a.horario}
                </p>
                <p className="text-sm text-gray-600">com {a.nutricionista}</p>
              </div>

              <div className="flex items-center justify-between gap-3 md:justify-end">
                <StatusBadge status={a.status} />
                {podeCancelar && (
                  <button
                    onClick={() => cancelar(a._id)}
                    className="rounded-md border border-red-300 px-3 py-1 text-sm font-semibold text-red-700 hover:bg-red-50"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default HistoricoConsultas;
