import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, X } from "lucide-react";
import StatusBadge from "./StatusBadge";
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

function podeConcluirConsulta(item, agora) {
  const [ano, mes, dia] = item.data.split("-").map(Number);
  const [hora, minuto] = item.horario.split(":").map(Number);
  const dataConsulta = new Date(ano, mes - 1, dia, hora, minuto);

  return (
    item.status === "Confirmado" &&
    !Number.isNaN(dataConsulta.getTime()) &&
    dataConsulta.getFullYear() === agora.getFullYear() &&
    dataConsulta.getMonth() === agora.getMonth() &&
    dataConsulta.getDate() === agora.getDate() &&
    agora.getTime() > dataConsulta.getTime()
  );
}

function timestampAgendamento(agendamento) {
  const [ano, mes, dia] = agendamento.data.split("-").map(Number);
  const [hora, minuto] = agendamento.horario.split(":").map(Number);
  return new Date(ano, mes - 1, dia, hora, minuto).getTime();
}

function Acoes({
  item,
  agora,
  ocupado,
  onStatus,
  onReagendar,
  onResponder,
  onRetirar,
  onSolicitarCancelamento,
  onSolicitarConfirmacao,
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
          onClick={() => onSolicitarConfirmacao(item)}
          className={`${btn} bg-green-700 text-white hover:bg-green-800`}
        >
          Confirmar
        </button>
      )}
      {podeConcluirConsulta(item, agora) && (
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
        onClick={() => onSolicitarCancelamento(item)}
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
  const [agora, setAgora] = useState(() => new Date());
  const [lista, setLista] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState("");
  const [erroAcao, setErroAcao] = useState("");
  const [reagendando, setReagendando] = useState(null);
  const [cancelando, setCancelando] = useState(null);
  const [confirmando, setConfirmando] = useState(null);

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

  useEffect(() => {
    const intervalo = window.setInterval(() => setAgora(new Date()), 15000);
    return () => window.clearInterval(intervalo);
  }, []);

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
  const confirmarCancelamento = () => {
    if (!cancelando) return;
    executar(() => atualizarStatus(cancelando._id, "Cancelado"));
    setCancelando(null);
  };
  const confirmarConsulta = () => {
    if (!confirmando) return;
    executar(() => atualizarStatus(confirmando._id, "Confirmado"));
    setConfirmando(null);
  };

  const termo = busca.trim().toLowerCase();
  const visiveis = lista
    .filter(
      (a) =>
      (status === "Todas" ||
        (Array.isArray(status) ? status.includes(a.status) : a.status === status)) &&
      (!termo ||
        (a.paciente || "").toLowerCase().includes(termo) ||
        String(a.numero).includes(termo)),
    )
    .sort((a, b) => {
      const dataA = timestampAgendamento(a);
      const dataB = timestampAgendamento(b);
      const futuroA = dataA >= agora.getTime();
      const futuroB = dataB >= agora.getTime();

      if (futuroA !== futuroB) return futuroA ? -1 : 1;
      if (dataA !== dataB) return futuroA ? dataA - dataB : dataB - dataA;
      return Number(a.numero) - Number(b.numero);
    });

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
      agora={agora}
      ocupado={ocupado}
      onStatus={mudarStatus}
      onReagendar={setReagendando}
      onResponder={responder}
      onRetirar={retirar}
      onSolicitarCancelamento={setCancelando}
      onSolicitarConfirmacao={setConfirmando}
    />
  );

  return (
    <div className="w-full">
      {erroAcao && (
        <p role="alert" className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700 shadow-sm">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          {erroAcao}
        </p>
      )}

      {/* Tabela: telas médias e grandes */}
      <div className="hidden overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm md:block">
        <table className="w-full min-w-[760px] text-left">
          <thead className="bg-gray-50 text-center text-xs uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-6 py-4 font-semibold">Atendimento</th>
              <th className="px-6 py-4 font-semibold">Paciente</th>
              <th className="px-6 py-4 font-semibold">Data e horário</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {visiveis.map((a) => (
              <tr key={a._id} className={`transition hover:bg-gray-50 ${a.solicitacao ? "bg-orange-50/30" : ""}`}>
                <td className="px-6 py-4 text-center font-semibold text-gray-700">#{a.numero}</td>
                <td className="px-6 py-4 text-left">
                  <div className="flex items-center justify-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-600">
                      {iniciais(a.paciente)}
                    </span>
                    <span className="font-medium text-gray-700">{a.paciente}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center text-gray-600">
                  <span className="font-medium">{formatarData(a.data)}</span>
                  <span className="ml-2 text-sm text-gray-400">{a.horario}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex min-w-32 flex-col items-center gap-2">
                    <StatusBadge status={a.status} solicitacao={a.solicitacao} />
                  </div>
                </td>
                <td className="px-6 py-4 text-center align-middle">
                  <div className="flex justify-center">{acoes(a)}</div>
                </td>
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
                <StatusBadge status={a.status} solicitacao={a.solicitacao} />
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
      {cancelando && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
          onClick={() => setCancelando(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancelar-agendamento-titulo"
            onClick={(event) => event.stopPropagation()}
            className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-7"
          >
            <button
              type="button"
              onClick={() => setCancelando(null)}
              aria-label="Fechar confirmação de cancelamento"
              className="absolute right-5 top-5 cursor-pointer rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <AlertTriangle size={24} />
            </div>
            <h2 id="cancelar-agendamento-titulo" className="pr-8 text-xl font-bold text-gray-900">
              Cancelar consulta?
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Tem certeza de que deseja cancelar a consulta de{" "}
              <strong className="font-semibold text-gray-800">{cancelando.paciente}</strong>{" "}
              em {formatarData(cancelando.data)} às {cancelando.horario}? Essa ação não
              poderá ser desfeita.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setCancelando(null)}
                className="cursor-pointer rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={confirmarCancelamento}
                className="cursor-pointer rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={ocupado}
              >
                {ocupado ? "Cancelando..." : "Sim, cancelar"}
              </button>
            </div>
          </div>
        </div>
      )}
      {confirmando && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
          onClick={() => setConfirmando(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirmar-agendamento-titulo"
            onClick={(event) => event.stopPropagation()}
            className="relative w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl sm:p-8"
          >
            <button
              type="button"
              onClick={() => setConfirmando(null)}
              aria-label="Fechar confirmação da consulta"
              className="absolute right-5 top-5 cursor-pointer rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-700">
              <CheckCircle2 size={24} />
            </div>
            <h2
              id="confirmar-agendamento-titulo"
              className="pr-8 text-xl font-bold text-gray-900"
            >
              Revisar e confirmar consulta
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Confira os dados abaixo antes de confirmar o atendimento:
            </p>
            <dl className="mt-5 divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-gray-50 px-4">
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="text-sm text-gray-500">Paciente</dt>
                <dd className="text-right text-sm font-semibold text-gray-900">
                  {confirmando.paciente}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="text-sm text-gray-500">Data</dt>
                <dd className="text-right text-sm font-semibold text-gray-900">
                  {formatarData(confirmando.data)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="text-sm text-gray-500">Horário</dt>
                <dd className="text-right text-sm font-semibold text-gray-900">
                  {confirmando.horario}
                </dd>
              </div>
            </dl>
            <p className="mt-5 text-sm text-gray-600">
              Deseja realmente confirmar esta consulta?
            </p>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setConfirmando(null)}
                className="cursor-pointer rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Revisar depois
              </button>
              <button
                type="button"
                onClick={confirmarConsulta}
                disabled={ocupado}
                className="cursor-pointer rounded-xl bg-green-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {ocupado ? "Confirmando..." : "Sim, confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Agendamentos;
