import { useCallback, useEffect, useState } from "react";
import StatusBadge, { PedidoBadge } from "./StatusBadge";
import ReagendarModal from "./ReagendarModal";
import {
  listarAgendamentos,
  atualizarStatus,
  responderSolicitacao,
  retirarSolicitacao,
} from "../services/agendamentoService";
import { formatarData, iniciais } from "../utils/formatters";

const btn =
  "cursor-pointer rounded-md px-3 py-1 text-xs md:text-sm font-semibold disabled:opacity-50";

const descricao = (sol) =>
  sol.tipo === "Cancelamento"
    ? "pediu o cancelamento"
    : `pediu para reagendar para ${formatarData(sol.novaData)} às ${sol.novoHorario}`;

function Acoes({
  item,
  ocupado,
  onStatus,
  onReagendar,
  onResponder,
  onRetirar,
}) {
  const sol = item.solicitacao;
  if (item.status === "Cancelado" || item.status === "Concluído") return null;

  // O paciente pediu algo: o nutricionista aprova ou recusa
  if (sol?.origem === "paciente") {
    return (
      <div className="flex flex-col items-center gap-2">
        <p className="max-w-60 text-xs text-gray-600">
          Paciente {descricao(sol)}.
          {sol.motivo && <> Motivo: “{sol.motivo}”.</>}
        </p>
        <div className="flex gap-2">
          <button
            disabled={ocupado}
            onClick={() => onResponder(item._id, true)}
            className={`${btn} bg-green-700 text-white hover:bg-green-800`}
          >
            Aprovar
          </button>
          <button
            disabled={ocupado}
            onClick={() => onResponder(item._id, false)}
            className={`${btn} border border-red-300 text-red-700 hover:bg-red-50`}
          >
            Recusar
          </button>
        </div>
      </div>
    );
  }

  // O nutricionista propôs novo horário: aguardando o paciente
  if (sol?.origem === "nutricionista") {
    return (
      <div className="flex flex-col items-center gap-2">
        <p className="max-w-60 text-xs text-gray-600">
          Proposta de {formatarData(sol.novaData)} às {sol.novoHorario} enviada.
          Aguardando o paciente.
        </p>
        <button
          disabled={ocupado}
          onClick={() => onRetirar(item._id)}
          className={`${btn} border border-gray-300 text-gray-700 hover:bg-gray-100`}
        >
          Retirar proposta
        </button>
      </div>
    );
  }

  // Sem pedido em andamento
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {item.status === "Pendente" && (
        <button
          disabled={ocupado}
          onClick={() => onStatus(item._id, "Confirmado")}
          className={`${btn} bg-green-700 text-white hover:bg-green-800`}
        >
          Confirmar
        </button>
      )}
      {item.status === "Confirmado" && (
        <button
          disabled={ocupado}
          onClick={() => onStatus(item._id, "Concluído")}
          className={`${btn} bg-blue-600 text-white hover:bg-blue-700`}
        >
          Concluir
        </button>
      )}
      <button
        disabled={ocupado}
        onClick={() => onReagendar(item)}
        className={`${btn} border border-green-700 text-green-800 hover:bg-green-50`}
      >
        Reagendar
      </button>
      <button
        disabled={ocupado}
        onClick={() => onStatus(item._id, "Cancelado")}
        className={`${btn} border border-red-300 text-red-700 hover:bg-red-50`}
      >
        Cancelar
      </button>
    </div>
  );
}

// <Agendamentos nutricionistaId={id} status="Todas" busca="" />
function Agendamentos({
  nutricionista,
  nutricionistaId,
  status = "Todas",
  busca = "",
}) {
  const [lista, setLista] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState("");
  const [erroAcao, setErroAcao] = useState("");
  const [reagendando, setReagendando] = useState(null);

  const carregar = useCallback(async () => {
    try {
      setErro("");
      setLista(await listarAgendamentos({ nutricionista, nutricionistaId }));
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, [nutricionista, nutricionistaId]);

  useEffect(() => {
    Promise.resolve().then(carregar);
  }, [carregar]);

  async function executar(acao) {
    setErroAcao("");
    try {
      setOcupado(true);
      await acao();
      await carregar();
    } catch (e) {
      setErroAcao(e.message);
    } finally {
      setOcupado(false);
    }
  }

  const mudarStatus = (id, novo) => executar(() => atualizarStatus(id, novo));
  const responder = (id, aceitar) =>
    executar(() => responderSolicitacao(id, "nutricionista", aceitar));
  const retirar = (id) =>
    executar(() => retirarSolicitacao(id, "nutricionista"));

  const termo = busca.trim().toLowerCase();
  const visiveis = lista.filter(
    (a) =>
      (status === "Todas" || a.status === status) &&
      (!termo ||
        (a.paciente || "").toLowerCase().includes(termo) ||
        String(a.numero).includes(termo)),
  );

  if (erro)
    return (
      <p className="rounded-md bg-red-100 p-4 text-center text-red-700">
        {erro}
      </p>
    );

  if (!carregando && visiveis.length === 0)
    return (
      <p className="rounded-xl bg-white p-8 text-center text-gray-600 shadow">
        Nenhuma consulta encontrada.
      </p>
    );

  const acoes = (a) => (
    <Acoes
      item={a}
      ocupado={ocupado}
      onStatus={mudarStatus}
      onReagendar={setReagendando}
      onResponder={responder}
      onRetirar={retirar}
    />
  );

  return (
    <div className="w-full">
      {erroAcao && (
        <p className="mb-3 rounded-md bg-red-100 p-3 text-sm font-semibold text-red-700">
          {erroAcao}
        </p>
      )}

      {/* Tabela: telas médias e grandes */}
      <div className="hidden overflow-hidden rounded-3xl bg-white shadow-sm md:block">
        <table className="w-full min-w-[760px] text-left">
          <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-6 py-4 font-semibold">Atendimento</th>
              <th className="px-6 py-4 font-semibold">Paciente</th>
              <th className="px-6 py-4 font-semibold">Data e horário</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 text-right font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {visiveis.map((a) => (
              <tr key={a._id} className={`transition hover:bg-gray-50 ${a.solicitacao ? "bg-orange-50/40" : ""}`}>
                <td className="px-6 py-4 font-semibold text-gray-700">#{a.numero}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-600">
                      {iniciais(a.paciente)}
                    </span>
                    <span className="font-medium text-gray-700">{a.paciente}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  <span className="font-medium">{formatarData(a.data)}</span>
                  <span className="ml-2 text-sm text-gray-400">{a.horario}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col items-center gap-1">
                    <StatusBadge status={a.status} />
                    <PedidoBadge solicitacao={a.solicitacao} />
                  </div>
                </td>
                <td className="px-6 py-4 text-right">{acoes(a)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards: celular */}
      <div className="space-y-3 md:hidden">
        {visiveis.map((a) => (
          <div
            key={a._id}
            className={`rounded-xl p-4 shadow ${a.solicitacao ? "bg-orange-50" : "bg-white"}`}
          >
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-bold text-gray-500">
                Atendimento #{a.numero}
              </span>
              <div className="flex flex-wrap items-center gap-1">
                <StatusBadge status={a.status} />
                <PedidoBadge solicitacao={a.solicitacao} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-300 text-xs font-bold text-slate-700">
                {iniciais(a.paciente)}
              </span>
              <div>
                <p className="font-semibold text-slate-800">{a.paciente}</p>
                <p className="text-sm text-gray-500">
                  {formatarData(a.data)} às {a.horario}
                </p>
              </div>
            </div>
            <div className="mt-3">{acoes(a)}</div>
          </div>
        ))}
      </div>

      {reagendando && (
        <ReagendarModal
          agendamento={reagendando}
          quem="nutricionista"
          onFechar={() => setReagendando(null)}
          onEnviado={() => {
            setReagendando(null);
            carregar();
          }}
        />
      )}
    </div>
  );
}

export default Agendamentos;
