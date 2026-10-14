import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Calendario from "./Calendario";
import { listarNutricionistas, buscarHorarios } from "../services/nutricionistaService";
import { solicitarAlteracao } from "../services/agendamentoService";
import { formatarData } from "../utils/formatters";

// quem: "paciente" (pede) | "nutricionista" (propõe)
function ReagendarModal({ agendamento, quem, onFechar, onEnviado }) {
  const [dias, setDias] = useState(undefined); // undefined = carregando, null = não achou
  const [data, setData] = useState("");
  const [horarios, setHorarios] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [horario, setHorario] = useState("");
  const [motivo, setMotivo] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  const doPaciente = quem === "paciente";

  useEffect(() => {
    listarNutricionistas()
      .then((l) => {
        const n = l.find((x) => x._id === agendamento.nutricionistaId);
        setDias(n ? n.diasAtendimento : null);
      })
      .catch((e) => setErro(e.message));
  }, []);

  useEffect(() => {
    setHorario("");
    setHorarios([]);
    if (!data) return;
    setCarregando(true);
    buscarHorarios(agendamento.nutricionistaId, data)
      .then(setHorarios)
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false));
  }, [data]);

  async function enviar() {
    setErro("");
    try {
      setEnviando(true);
      await solicitarAlteracao(agendamento._id, {
        tipo: "Reagendamento",
        origem: quem,
        novaData: data,
        novoHorario: horario,
        motivo,
      });
      onEnviado();
    } catch (e) {
      setErro(e.message);
    } finally {
      setEnviando(false);
    }
  }

  const livres = horarios.filter((h) => h.livre).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onFechar}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 text-left shadow-2xl"
      >
        <button
          type="button"
          onClick={onFechar}
          aria-label="Fechar"
          className="absolute right-4 top-4 cursor-pointer text-gray-500 hover:text-gray-800"
        >
          <X size={20} />
        </button>

        <h2 className="pr-8 text-xl font-bold text-gray-800">
          {doPaciente ? "Solicitar reagendamento" : "Propor novo horário"}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Consulta #{agendamento.numero} · atualmente em {formatarData(agendamento.data)} às{" "}
          {agendamento.horario}
        </p>
        <p className="mt-1 text-sm text-gray-500">
          {doPaciente
            ? "O nutricionista precisará aprovar o novo horário."
            : `${agendamento.paciente} precisará confirmar o novo horário.`}
        </p>

        <div className="mt-4 flex justify-center">
          {dias === undefined && !erro && <p className="text-gray-500">Carregando agenda...</p>}
          {dias === null && (
            <p className="text-red-700">Não foi possível carregar a agenda deste nutricionista.</p>
          )}
          {dias && <Calendario value={data} onChange={setData} diasAtendimento={dias} />}
        </div>

        {data && (
          <div className="mt-4">
            <p className="mb-2 font-semibold text-gray-700">Horário em {formatarData(data)}</p>
            {carregando ? (
              <p className="text-gray-500">Buscando horários...</p>
            ) : livres === 0 ? (
              <p className="text-gray-500">Não há horários livres nesse dia. Escolha outra data.</p>
            ) : (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {horarios.map(({ hora, livre }) => (
                  <button
                    type="button"
                    key={hora}
                    disabled={!livre}
                    onClick={() => setHorario(hora)}
                    className={`rounded-lg py-2 text-sm font-semibold transition ${
                      horario === hora
                        ? "bg-green-700 text-white shadow-md"
                        : "bg-green-50 text-green-900 hover:bg-green-200"
                    } disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-300 disabled:line-through`}
                  >
                    {hora}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {horario && (
          <label className="mt-4 block text-sm font-semibold text-gray-700">
            Motivo (opcional)
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              maxLength={300}
              rows={2}
              className="mt-1 w-full rounded-lg border border-gray-300 p-2 font-normal"
            />
          </label>
        )}

        {erro && (
          <p className="mt-4 rounded-md bg-red-100 p-3 text-sm font-semibold text-red-700">{erro}</p>
        )}

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onFechar}
            className="cursor-pointer rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300"
          >
            Voltar
          </button>
          <button
            type="button"
            disabled={!horario || enviando}
            onClick={enviar}
            className="cursor-pointer rounded-md bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {enviando ? "Enviando..." : doPaciente ? "Enviar solicitação" : "Enviar proposta"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReagendarModal;
