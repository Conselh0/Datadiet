import { useEffect, useState } from "react";
import StatusBadge, { PedidoBadge } from "./StatusBadge";
import ReagendarModal from "./ReagendarModal";
import {
  listarAgendamentos,
  solicitarAlteracao,
  responderSolicitacao,
  retirarSolicitacao,
  getUsuarioId,
} from "../services/agendamentoService";
import { formatarData } from "../utils/formatters";

const FILTROS = ["Todas", "Pendente", "Confirmado", "Concluído", "Cancelado"];
const ATIVOS = ["Pendente", "Confirmado"];

const botao = "cursor-pointer rounded-md px-3 py-1 text-sm font-semibold disabled:opacity-50";

function HistoricoConsultas() {
  const [lista, setLista] = useState([]);
  const [filtro, setFiltro] = useState("Todas");
  const [carregando, setCarregando] = useState(true);
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");

  const [reagendando, setReagendando] = useState(null);
  const [cancelando, setCancelando] = useState(null);
  const [motivo, setMotivo] = useState("");

  const carregar = async () => {
    try {
      setLista(await listarAgendamentos({ pacienteId: getUsuarioId() }));
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  // Executa uma ação e recarrega a lista. Devolve true se deu certo.
  async function executar(acao, mensagemOk) {
    setErro("");
    setAviso("");
    try {
      setOcupado(true);
      await acao();
      await carregar();
      if (mensagemOk) setAviso(mensagemOk);
      return true;
    } catch (e) {
      setErro(e.message);
      return false;
    } finally {
      setOcupado(false);
    }
  }

  async function enviarCancelamento() {
    const ok = await executar(
      () =>
        solicitarAlteracao(cancelando._id, {
          tipo: "Cancelamento",
          origem: "paciente",
          motivo,
        }),
      "Solicitação de cancelamento enviada. Aguarde a confirmação do nutricionista."
    );
    if (ok) {
      setCancelando(null);
      setMotivo("");
    }
  }

  const visiveis = filtro === "Todas" ? lista : lista.filter((a) => a.status === filtro);
  const temAtiva = lista.some((a) => ATIVOS.includes(a.status));

  return (
    <section className="w-full">
      <h2 className="mb-4 text-xl font-bold text-green-950 md:text-2xl">Suas consultas</h2>

      {temAtiva && (
        <p className="mb-4 rounded-xl bg-green-100 p-3 text-sm text-green-900">
          Você poderá agendar uma nova consulta depois que a atual for concluída ou o cancelamento
          for confirmado pelo nutricionista.
        </p>
      )}

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTROS.map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`cursor-pointer rounded-full px-4 py-1 text-sm font-semibold transition ${
              filtro === f
                ? "bg-green-900 text-white"
                : "border border-green-900 bg-white text-green-900 hover:bg-green-50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {erro && <p className="mb-3 rounded-md bg-red-100 p-3 text-red-700">{erro}</p>}
      {aviso && <p className="mb-3 rounded-md bg-green-100 p-3 text-green-800">{aviso}</p>}
      {carregando && <p className="text-gray-600">Carregando consultas...</p>}
      {!carregando && visiveis.length === 0 && (
        <p className="rounded-xl border border-green-200 bg-green-50 p-8 text-center text-green-950 shadow-sm">
          Nenhuma consulta encontrada nesse filtro.
        </p>
      )}

      <ul className="space-y-3">
        {visiveis.map((a) => {
          const ativa = ATIVOS.includes(a.status);
          const sol = a.solicitacao;
          const doPaciente = sol?.origem === "paciente";
          const doNutri = sol?.origem === "nutricionista";

          return (
            <li key={a._id} className="rounded-xl border border-green-200 bg-green-50 p-4 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-500">Atendimento #{a.numero}</p>
                  <p className="text-lg font-bold text-slate-800">
                    {formatarData(a.data)} às {a.horario}
                  </p>
                  <p className="text-sm text-gray-600">com {a.nutricionista}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={a.status} />
                  <PedidoBadge solicitacao={sol} />
                </div>
              </div>

              {/* Sem pedido em andamento: o paciente pode pedir mudança */}
              {ativa && !sol && (
                <div className="mt-3 flex flex-wrap justify-end gap-2">
                  <button
                    disabled={ocupado}
                    onClick={() => setReagendando(a)}
                    className={`${botao} border border-green-700 text-green-800 hover:bg-green-50`}
                  >
                    Solicitar Reagendamento
                  </button>
                  <button
                    disabled={ocupado}
                    onClick={() => setCancelando(a)}
                    className={`${botao} border border-red-300 text-red-700 hover:bg-red-50`}
                  >
                    Solicitar cancelamento
                  </button>
                </div>
              )}

              {/* Pedido feito pelo paciente: aguardando o nutricionista */}
              {doPaciente && (
                <div className="mt-3 flex flex-col gap-2 rounded-lg bg-orange-50 p-3 text-sm text-orange-900 sm:flex-row sm:items-center sm:justify-between">
                  <p>
                    {sol.tipo === "Cancelamento"
                      ? "Você pediu o cancelamento desta consulta."
                      : `Você pediu para reagendar para ${formatarData(sol.novaData)} às ${sol.novoHorario}.`}{" "}
                    Aguardando a resposta do nutricionista.
                  </p>
                  <button
                    disabled={ocupado}
                    onClick={() =>
                      executar(() => retirarSolicitacao(a._id, "paciente"), "Solicitação retirada.")
                    }
                    className={`${botao} shrink-0 border border-orange-300 hover:bg-orange-100`}
                  >
                    Retirar solicitação
                  </button>
                </div>
              )}

              {/* Proposta do nutricionista: o paciente decide */}
              {doNutri && (
                <div className="mt-3 rounded-lg bg-yellow-50 p-3 text-sm text-yellow-900">
                  <p>
                    O nutricionista propôs reagendar para{" "}
                    <b>
                      {formatarData(sol.novaData)} às {sol.novoHorario}
                    </b>
                    .{sol.motivo && <> Motivo: “{sol.motivo}”.</>}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <button
                      disabled={ocupado}
                      onClick={() =>
                        executar(() => responderSolicitacao(a._id, "paciente", true), "Novo horário confirmado!")
                      }
                      className={`${botao} bg-green-700 text-white hover:bg-green-800`}
                    >
                      Aceitar
                    </button>
                    <button
                      disabled={ocupado}
                      onClick={() =>
                        executar(
                          () => responderSolicitacao(a._id, "paciente", false),
                          "Proposta recusada. A consulta continua no horário original."
                        )
                      }
                      className={`${botao} border border-red-300 text-red-700 hover:bg-red-50`}
                    >
                      Recusar
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {reagendando && (
        <ReagendarModal
          agendamento={reagendando}
          quem="paciente"
          onFechar={() => setReagendando(null)}
          onEnviado={() => {
            setReagendando(null);
            setAviso("Solicitação de reagendamento enviada. Aguarde a aprovação do nutricionista.");
            carregar();
          }}
        />
      )}

      {cancelando && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={() => setCancelando(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
          >
            <h3 className="text-xl text-center font-bold text-green-950">Solicitar cancelamento</h3>
            <p className="mt-2  text-sm text-gray-600">
              Consulta de {formatarData(cancelando.data)} às {cancelando.horario}. O cancelamento só
              vale depois que o nutricionista confirmar.
            </p>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              maxLength={300}
              rows={3}
              placeholder="Motivo (opcional)"
              className="mt-3 w-full rounded-lg border border-gray-300 p-2 text-sm"
            />
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setCancelando(null)}
                className="cursor-pointer rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300"
              >
                Voltar
              </button>
              <button
                disabled={ocupado}
                onClick={enviarCancelamento}
                className="cursor-pointer rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-50"
              >
                Enviar solicitação
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default HistoricoConsultas;
