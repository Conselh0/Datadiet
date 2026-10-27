import { useEffect, useState } from "react";
import { CalendarDays, Clock3, UserRound } from "lucide-react";
import ReagendarModal from "./ReagendarModal";
import {
  buscarProximaConsulta,
  getUsuarioId,
  retirarSolicitacao,
  responderSolicitacao,
  solicitarAlteracao,
} from "../services/agendamentoService";
import { formatarData } from "../utils/formatters";

// Coloque dentro da tela de Perfil: <ProximaConsulta />
// Passe refresh={numero} para recarregar depois de um novo agendamento
function ProximaConsulta({ refresh }) {
  const [consulta, setConsulta] = useState(null);
  const [erro, setErro] = useState(() =>
    getUsuarioId() ? "" : "Não foi possível identificar o paciente logado.",
  );
  const [carregando, setCarregando] = useState(() =>
    Boolean(getUsuarioId()),
  );
  const [ocupado, setOcupado] = useState(false);
  const [aviso, setAviso] = useState("");
  const [reagendando, setReagendando] = useState(false);
  const [cancelando, setCancelando] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [erroAcao, setErroAcao] = useState("");

  async function carregarConsulta() {
    const id = getUsuarioId();
    if (!id) return;
    try {
      setConsulta(await buscarProximaConsulta(id));
      setErro("");
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    let ativo = true;
    const id = getUsuarioId();
    if (!id) return;
    buscarProximaConsulta(id)
      .then((dados) => {
        if (ativo) {
          setConsulta(dados);
          setErro("");
        }
      })
      .catch((e) => {
        if (ativo) setErro(e.message);
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [refresh]);

  async function executarAcao(acao, mensagem) {
    setErroAcao("");
    setAviso("");
    try {
      setOcupado(true);
      await acao();
      setAviso(mensagem);
      await carregarConsulta();
      return true;
    } catch (e) {
      setErroAcao(e.message);
      return false;
    } finally {
      setOcupado(false);
    }
  }

  async function enviarCancelamento() {
    const sucesso = await executarAcao(
      () =>
        solicitarAlteracao(consulta._id, {
          tipo: "Cancelamento",
          origem: "paciente",
          motivo,
        }),
      "Solicitação de cancelamento enviada. Aguarde a confirmação do nutricionista.",
    );
    if (sucesso) {
      setCancelando(false);
      setMotivo("");
    }
  }

  async function responderProposta(aceitar) {
    await executarAcao(
      () => responderSolicitacao(consulta._id, "paciente", aceitar),
      aceitar
        ? "Novo horário confirmado."
        : "Proposta recusada. A consulta continua no horário original.",
    );
  }

  async function retirarPedido() {
    await executarAcao(
      () => retirarSolicitacao(consulta._id, "paciente"),
      "Solicitação retirada.",
    );
  }

  const solicitacao = consulta?.solicitacao;
  const propostaNutricionista = solicitacao?.origem === "nutricionista";
  const pedidoPaciente = solicitacao?.origem === "paciente";
  const classeStatus = {
    Confirmado: "border-green-200 bg-green-50 text-green-800",
    Pendente: "border-amber-200 bg-amber-50 text-amber-800",
    Concluído: "border-blue-200 bg-blue-50 text-blue-800",
    Cancelado: "border-red-200 bg-red-50 text-red-800",
  }[consulta?.status] || "border-gray-200 bg-white text-gray-700";
  const botaoAcao =
    "cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <section className="w-full overflow-hidden rounded-3xl border border-gray-200 bg-gray-200 shadow-xl shadow-gray-900/5">
      <header className="relative flex items-center gap-4 overflow-hidden bg-gradient-to-br from-emerald-950 via-green-900 to-emerald-800 px-5 py-5 text-white sm:px-7">
        <div aria-hidden="true" className="pointer-events-none absolute -right-6 -top-16 h-40 w-40 rounded-full border-[22px] border-white/[0.06]" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 right-32 h-32 w-32 rounded-full bg-white/[0.04]" />
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white">
          <CalendarDays size={23} strokeWidth={1.8} aria-hidden="true" />
        </div>
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-green-100">
            Acompanhamento
          </p>
          <h2 className="mt-1 text-xl font-bold sm:text-2xl">
            Sua próxima consulta
          </h2>
        </div>
      </header>

      <div className="space-y-4 bg-gray-200 p-5 sm:p-7">
        {carregando ? (
          <p className="rounded-2xl border border-gray-300 bg-gray-100 p-5 text-center font-medium text-gray-800">
            Carregando sua próxima consulta...
          </p>
        ) : erro ? (
          <p role="alert" className="rounded-2xl bg-red-50 p-5 text-red-700">
            {erro}
          </p>
        ) : consulta ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-4 rounded-2xl border border-gray-300 bg-gray-100 p-5 shadow-sm">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-green-100 bg-white text-emerald-800 shadow-sm">
                  <CalendarDays size={20} strokeWidth={1.8} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-600">
                    Data
                  </p>
                  <p className="mt-1 text-xl font-bold text-gray-900">
                    {formatarData(consulta.data)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-2xl border border-gray-300 bg-gray-100 p-5 shadow-sm">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-green-100 bg-white text-emerald-800 shadow-sm">
                  <Clock3 size={20} strokeWidth={1.8} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-600">
                    Horário
                  </p>
                  <p className="mt-1 text-xl font-bold text-gray-900">
                    {consulta.horario}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-gray-300 bg-gray-100 p-4 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600">
                    <UserRound size={18} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-600">
                      Nutricionista responsável
                    </p>
                    <p className="mt-0.5 truncate font-semibold text-gray-900">
                      {consulta.nutricionista}
                    </p>
                  </div>
                </div>
                <span className={`self-start rounded-full border px-3 py-1 text-sm font-semibold sm:self-auto ${classeStatus}`}>
                  {consulta.status}
                </span>
              </div>

              {propostaNutricionista && (
                <div className="mt-4 rounded-xl border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-950">
                  <p>
                    O nutricionista propôs reagendar para{" "}
                    <strong>
                      {formatarData(solicitacao.novaData)} às {solicitacao.novoHorario}
                    </strong>
                    . {solicitacao.motivo && `Motivo: “${solicitacao.motivo}”.`}
                  </p>
                  <div className="mt-3 flex flex-wrap justify-end gap-2">
                    <button
                      type="button"
                      disabled={ocupado}
                      onClick={() => responderProposta(true)}
                      className={`${botaoAcao} bg-green-800 text-white shadow-sm hover:bg-green-900`}
                    >
                      Aceitar proposta
                    </button>
                    <button
                      type="button"
                      disabled={ocupado}
                      onClick={() => responderProposta(false)}
                      className={`${botaoAcao} border border-red-300 bg-white text-red-700 hover:bg-red-50`}
                    >
                      Recusar
                    </button>
                  </div>
                </div>
              )}

              {pedidoPaciente && (
                <div className="mt-4 flex flex-col gap-3 rounded-xl border border-orange-200 bg-orange-50 p-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-orange-900">
                    {solicitacao.tipo === "Cancelamento"
                      ? "Você solicitou o cancelamento desta consulta."
                      : `Você solicitou reagendar para ${formatarData(solicitacao.novaData)} às ${solicitacao.novoHorario}.`}{" "}
                    Aguardando a resposta do nutricionista.
                  </p>
                  <button
                    type="button"
                    disabled={ocupado}
                    onClick={retirarPedido}
                    className={`${botaoAcao} shrink-0 border border-orange-300 bg-white text-orange-800 hover:bg-orange-100`}
                  >
                    Retirar solicitação
                  </button>
                </div>
              )}

              {!solicitacao && (
                <div className="mt-4 flex flex-col justify-end gap-2 border-t border-gray-200 pt-4 sm:flex-row">
                  <button
                    type="button"
                    disabled={ocupado}
                    onClick={() => {
                      setErroAcao("");
                      setReagendando(true);
                    }}
                    className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl border border-green-800 bg-green-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Solicitar Reagendamento
                  </button>
                  <button
                    type="button"
                    disabled={ocupado}
                    onClick={() => {
                      setErroAcao("");
                      setCancelando(true);
                    }}
                    className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl border border-red-300 bg-white px-5 py-2.5 text-sm font-semibold text-red-700 shadow-sm transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Solicitar Cancelamento
                  </button>
                </div>
              )}
            </div>
            {erroAcao && (
              <p role="alert" className="rounded-xl bg-red-100 p-3 text-sm text-red-700">
                {erroAcao}
              </p>
            )}
            {aviso && (
              <p role="status" className="rounded-xl bg-green-100 p-3 text-sm text-green-900">
                {aviso}
              </p>
            )}
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-400 bg-gray-100 p-6 text-center">
            <CalendarDays
              size={28}
              className="mx-auto text-emerald-800"
              aria-hidden="true"
            />
            <p className="mt-3 font-semibold text-green-950">
              Você ainda não tem uma próxima consulta.
            </p>
            <p className="mt-1 text-sm text-green-900/70">
              Acesse “Agendar consulta” para escolher um horário.
            </p>
          </div>
        )}
      </div>
      {reagendando && consulta && (
        <ReagendarModal
          agendamento={consulta}
          quem="paciente"
          onFechar={() => setReagendando(false)}
          onEnviado={() => {
            setReagendando(false);
            setAviso("Solicitação de reagendamento enviada. Aguarde a aprovação do nutricionista.");
            carregarConsulta();
          }}
        />
      )}
      {cancelando && consulta && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={() => setCancelando(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancelar-consulta-titulo"
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
          >
            <h3 id="cancelar-consulta-titulo" className="text-xl text-center font-bold text-gray-900">
              Solicitar cancelamento
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Consulta de {formatarData(consulta.data)} às {consulta.horario}. O cancelamento
              depende da confirmação do nutricionista.
            </p>
            <textarea
              value={motivo}
              onChange={(event) => setMotivo(event.target.value)}
              maxLength={80}
              rows={3}
              placeholder="Motivo (opcional)"
              aria-label="Motivo do cancelamento"
              className="mt-3 w-full rounded-lg border border-gray-300 p-2 text-sm"
            />
            {erroAcao && (
              <p role="alert" className="mt-3 rounded-lg bg-red-100 p-3 text-sm text-red-700">
                {erroAcao}
              </p>
            )}
            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setCancelando(false)}
                className="cursor-pointer rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300"
              >
                Voltar
              </button>
              <button
                type="button"
                disabled={ocupado}
                onClick={enviarCancelamento}
                className="cursor-pointer rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {ocupado ? "Enviando..." : "Enviar solicitação"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default ProximaConsulta;
