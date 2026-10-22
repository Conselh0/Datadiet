import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Check } from "lucide-react";
import NutricionistaCard from "../components/NutricionistaCard";
import Calendario from "../components/Calendario";
import FormAnamnese from "../components/FormAnamnese";
import { listarNutricionistas, buscarHorarios } from "../services/nutricionistaService";
import {
  criarAgendamento,
  listarAgendamentos,
  getUsuario,
  getUsuarioId,
  buscarStatusAnamnese,
} from "../services/agendamentoService";
import { formatarData } from "../utils/formatters";

const ETAPAS = ["Nutricionista", "Data", "Horário", "Ficha", "Confirmar"];
const ATIVOS = ["Pendente", "Confirmado"];

// Barra de progresso: etapas já feitas podem ser clicadas para voltar
function Etapas({ passo, onIr }) {
  return (
    <ol
      aria-label="Etapas do agendamento"
      className="mb-8 flex w-full max-w-3xl items-start justify-between rounded-2xl border border-gray-200 bg-white px-3 py-4 shadow-sm sm:px-6 sm:py-5"
    >
      {ETAPAS.map((nome, i) => {
        const n = i + 1;
        const feita = n < passo;
        const atual = n === passo;
        return (
          <li key={nome} className="flex min-w-0 flex-1 flex-col items-center">
            <div className="flex w-full items-center">
              <span
                aria-hidden="true"
                className={`h-0.5 flex-1 ${i === 0 ? "invisible" : feita || atual ? "bg-emerald-700" : "bg-gray-200"}`}
              />
              <button
                type="button"
                disabled={!feita}
                onClick={() => onIr(n)}
                aria-label={`Etapa ${n}: ${nome}`}
                aria-current={atual ? "step" : undefined}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold transition sm:h-10 sm:w-10 ${
                  feita
                    ? "cursor-pointer border-emerald-700 bg-emerald-700 text-white shadow-sm hover:bg-emerald-800"
                    : atual
                    ? "border-emerald-700 bg-white text-emerald-800 ring-4 ring-emerald-100"
                    : "border-gray-200 bg-gray-50 text-gray-400"
                }`}
              >
                {feita ? <Check size={18} /> : n}
              </button>
              <span
                aria-hidden="true"
                className={`h-0.5 flex-1 ${i === ETAPAS.length - 1 ? "invisible" : feita ? "bg-emerald-700" : "bg-gray-200"}`}
              />
            </div>
            <span className={`mt-2 hidden text-xs font-semibold sm:block ${atual ? "text-emerald-900" : feita ? "text-emerald-800" : "text-gray-400"}`}>
              {nome}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function Titulo({ texto, detalhe }) {
  return (
    <div className="mb-6 text-center">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">{texto}</h2>
      {detalhe && <p className="mt-2 text-sm text-gray-600 sm:text-base">{detalhe}</p>}
    </div>
  );
}

function Voltar({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-6 cursor-pointer rounded-lg px-4 py-2 font-semibold text-emerald-800 transition hover:bg-emerald-50 hover:text-emerald-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
    >
      Voltar
    </button>
  );
}

function Agendamentos() {
  const [passo, setPasso] = useState(1);

  // Regra: só agenda outra consulta quando não houver uma em andamento
  const [verificando, setVerificando] = useState(true);
  const [emAndamento, setEmAndamento] = useState(null);
  const [statusAnamnese, setStatusAnamnese] = useState(null);

  const [nutricionistas, setNutricionistas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroLista, setErroLista] = useState("");

  const [selecionado, setSelecionado] = useState(null);
  const [data, setData] = useState("");
  const [horarios, setHorarios] = useState([]);
  const [carregandoHorarios, setCarregandoHorarios] = useState(false);
  const [horario, setHorario] = useState("");
  const [anamnese, setAnamnese] = useState(null);
  const [anamneseId, setAnamneseId] = useState(null);

  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(null);

  useEffect(() => {
    listarNutricionistas()
      .then(setNutricionistas)
      .catch((e) => setErroLista(e.message))
      .finally(() => setCarregando(false));

    const id = getUsuarioId();
    if (!id) return setVerificando(false);
    listarAgendamentos({ pacienteId: id })
      .then((l) => setEmAndamento(l.find((a) => ATIVOS.includes(a.status)) || null))
      .catch((e) => setErro(e.message));
    buscarStatusAnamnese(id)
      .then(setStatusAnamnese)
      .catch((e) => setErro(e.message))
      .finally(() => setVerificando(false));
  }, []);

  const carregarHorarios = async () => {
    if (!selecionado || !data) return;
    try {
      setCarregandoHorarios(true);
      setHorarios(await buscarHorarios(selecionado._id, data));
    } catch (e) {
      setHorarios([]);
      setErro(e.message);
    } finally {
      setCarregandoHorarios(false);
    }
  };

  useEffect(() => {
    setHorario("");
    setHorarios([]);
    carregarHorarios();
  }, [selecionado, data]);

  const escolherNutricionista = (n) => {
    if (n._id !== selecionado?._id) setData("");
    setSelecionado(n);
    setErro("");
    setPasso(2);
  };

  const escolherData = (d) => {
    setData(d);
    setErro("");
    setPasso(3);
  };

  const escolherHorario = (h) => {
    setHorario(h);
    setErro("");
    if (statusAnamnese?.fichaAtual && !statusAnamnese.atualizacaoNecessaria) {
      setAnamnese({});
      setAnamneseId(statusAnamnese.fichaAtual._id);
      setPasso(5);
    } else {
      setAnamnese(null);
      setAnamneseId(null);
      setPasso(4);
    }
  };

  const guardarFicha = (ficha) => {
    setAnamnese(ficha);
    setPasso(5);
  };

  const confirmar = async () => {
    setErro("");
    if (!getUsuario().nome) {
      return setErro("Não foi possível identificar o paciente. Entre na sua conta e tente novamente.");
    }
    try {
      setEnviando(true);
      const tipoAnamnese = statusAnamnese?.tipoNecessario || statusAnamnese?.fichaAtual?.tipo || "inicial";
      const resultado = await criarAgendamento({ nutricionistaId: selecionado._id, data, horario, anamnese, tipoAnamnese, anamneseId });
      setSucesso({
        nutricionista: selecionado.nome,
        data,
        horario,
        notificacoes: resultado.notificacoes,
      });
    } catch (e) {
      setErro(e.message);
      // Horário tomado por outra pessoa: volta para escolher outro
      if (e.status === 409 && /ocupado/i.test(e.message)) {
        setHorario("");
        carregarHorarios();
        setPasso(3);
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="relative isolate min-h-screen w-full min-w-0 overflow-hidden bg-gradient-to-br from-emerald-950 via-green-900 to-emerald-800 px-4 py-8 pb-16 sm:px-6 sm:py-10">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="absolute -left-28 -top-32 h-80 w-80 rounded-full border-[36px] border-white/[0.07]" />
        <span className="absolute -right-24 top-24 h-72 w-72 rounded-full bg-green-400/[0.08] blur-2xl" />
        <span className="absolute -bottom-40 left-[18%] h-96 w-96 rounded-full border-[48px] border-white/[0.06]" />
        <span className="absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-emerald-400/[0.08] blur-3xl" />
      </div>
      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center rounded-3xl border border-white/70 bg-white/95 p-5 text-center shadow-2xl shadow-emerald-950/20 backdrop-blur-sm sm:p-8">
        <header className="mb-8 max-w-2xl">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">
            Cuidado feito para você
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
            Agende sua consulta
          </h1>
          <p className="mt-3 text-sm leading-6 text-gray-600 sm:text-base">
            Siga as etapas para escolher o profissional, o horário e confirmar seu atendimento.
          </p>
        </header>

      {verificando ? (
        <p className="text-gray-600">Verificando suas consultas...</p>
      ) : erro && !emAndamento && !sucesso ? (
        <p className="max-w-md rounded-md bg-red-100 p-3 font-semibold text-red-700">{erro}</p>
      ) : sucesso ? (
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
          <p className="text-2xl font-bold text-green-800">Consulta agendada!</p>
          <p className="mt-4 text-lg text-slate-700">
            {formatarData(sucesso.data)} às {sucesso.horario}
          </p>
          <p className="text-slate-600">com {sucesso.nutricionista}</p>
          <p className="mt-4 text-sm text-gray-500">
            Sua ficha de anamnese foi registrada e vinculada a esta consulta. O nutricionista vai confirmar o atendimento.
          </p>
          {sucesso.notificacoes?.paciente && sucesso.notificacoes?.nutricionista ? (
            <p className="mt-3 text-sm text-green-700">
              Enviamos um e-mail para você e para a nutricionista.
            </p>
          ) : (
            <p role="status" className="mt-3 text-sm text-amber-700">
              Não foi possível enviar todos os e-mails de notificação. A consulta está agendada; entre em contato com a equipe para verificar o envio.
            </p>
          )}
          <Link
            to="/User/Historico"
            className="mt-6 block w-full rounded-lg bg-green-600 py-2 font-bold text-white hover:bg-green-700"
          >
            Ver minhas consultas
          </Link>
        </div>
      ) : emAndamento ? (
        <section
          className="w-full max-w-2xl overflow-hidden rounded-3xl border border-green-200 bg-gray-50 text-left shadow-lg shadow-gray-900/10"
          aria-labelledby="consulta-andamento-titulo"
        >
          <div className="flex items-start gap-4 border-b border-green-100 bg-green-50/80 p-5 sm:p-7">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-800 text-white shadow-sm">
              <CalendarDays size={23} strokeWidth={1.8} aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-800">
                Acompanhamento
              </p>
              <h2
                id="consulta-andamento-titulo"
                className="mt-1 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl"
              >
                Você já tem uma consulta agendada
              </h2>
            </div>
          </div>
          <div className="p-5 sm:p-7">
            <p className="max-w-xl text-sm leading-6 text-gray-600 sm:text-base">
              Para agendar outra consulta, aguarde a conclusão da atual ou a confirmação do
              cancelamento. Se precisar alterar o horário, você pode solicitar o reagendamento
              na sua consulta.
            </p>
            <div className="mt-6 flex flex-col gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-gray-500">
                Acesse os detalhes e as opções da consulta.
              </p>
              <Link
                to="/User/MinhaConsulta"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-green-800 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2"
              >
                Ver minha consulta
                <CalendarDays size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <>
          <Etapas passo={passo} onIr={setPasso} />

          {/* Etapa 1: nutricionista */}
          {passo === 1 && (
            <section className="flex w-full max-w-5xl flex-col items-center">
              <Titulo texto="Escolha o nutricionista" detalhe="Toque no card do profissional para continuar." />
              {carregando && <p className="text-gray-600">Carregando nutricionistas...</p>}
              {erroLista && <p className="rounded-md bg-red-100 p-3 text-red-700">{erroLista}</p>}
              {!carregando && !erroLista && nutricionistas.length === 0 && (
                <p className="rounded-xl bg-white p-6 text-gray-600 shadow">
                  Nenhum nutricionista cadastrado ainda.
                </p>
              )}
              <div className="flex flex-wrap justify-center gap-6">
                {nutricionistas.map((n) => (
                  <NutricionistaCard
                    key={n._id}
                    nutricionista={n}
                    selecionado={selecionado?._id === n._id}
                    temaPaciente
                    onClick={() => escolherNutricionista(n)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Etapa 2: data */}
          {passo === 2 && selecionado && (
            <section className="flex w-full flex-col items-center">
              <Titulo texto="Escolha a data" detalhe={`Atendimento com ${selecionado.nome}`} />
              <Calendario
                key={selecionado._id}
                value={data}
                onChange={escolherData}
                diasAtendimento={selecionado.diasAtendimento}
              />
              <Voltar onClick={() => setPasso(1)} />
            </section>
          )}

          {/* Etapa 3: horário */}
          {passo === 3 && selecionado && data && (
            <section className="flex w-full min-w-0 max-w-2xl flex-col items-center">
              <Titulo texto="Escolha o horário" detalhe={`${selecionado.nome} · ${formatarData(data)}`} />
              <div className="w-full rounded-2xl bg-white p-5 shadow-lg">
                {carregandoHorarios ? (
                  <p className="text-gray-600">Buscando horários...</p>
                ) : horarios.filter((h) => h.livre).length === 0 ? (
                  <p className="text-gray-600">
                    Não há horários livres nesse dia. Volte e escolha outra data.
                  </p>
                ) : (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                    {horarios.map(({ hora, livre }) => (
                      <button
                        type="button"
                        key={hora}
                        disabled={!livre}
                        onClick={() => escolherHorario(hora)}
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
              <Voltar onClick={() => setPasso(2)} />
            </section>
          )}

          {/* Etapa 4: ficha inicial ou atualização de acompanhamento */}
          {passo === 4 && selecionado && data && horario && (
            <section className="flex w-full min-w-0 max-w-3xl flex-col items-center px-1">
              <Titulo
                texto={statusAnamnese?.tipoNecessario === "acompanhamento" ? "Atualização para acompanhamento" : "Avaliação nutricional inicial"}
                detalhe={
                  statusAnamnese?.tipoNecessario === "acompanhamento"
                    ? `Ficha de atualização • a cada 2 consultas concluídas • ${formatarData(data)} às ${horario}`
                    : `Consulta em ${formatarData(data)} às ${horario}`
                }
              />
              <FormAnamnese
                key={statusAnamnese?.tipoNecessario || "inicial"}
                tipo={statusAnamnese?.tipoNecessario || "inicial"}
                inicial={anamnese}
                onContinuar={guardarFicha}
              />
              <Voltar onClick={() => setPasso(3)} />
            </section>
          )}

          {/* Etapa 5: confirmação */}
          {passo === 5 && selecionado && data && horario && anamnese && (
            <section className="flex w-full max-w-md flex-col items-center">
              <div className="w-full overflow-hidden rounded-3xl border border-gray-200 bg-gray-200 text-left shadow-xl shadow-gray-900/10">
                <header className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-green-900 to-emerald-800 px-5 py-6 text-white">
                  <div className="pointer-events-none absolute -right-8 -top-16 h-44 w-44 rounded-full border-[24px] border-white/[0.06]" />
                  <div className="pointer-events-none absolute -bottom-20 right-28 h-32 w-32 rounded-full bg-white/[0.04]" />
                  <div className="relative">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-100">
                      Resumo do agendamento
                    </p>
                    <h2 className="mt-1 text-2xl font-bold">Confirme sua consulta</h2>
                    <p className="mt-2 text-sm text-green-100/80">
                      Confira os dados antes de confirmar.
                    </p>
                  </div>
                </header>

                <div className="space-y-4 bg-gray-200 p-5">
                  <div className="rounded-2xl border border-gray-300 bg-gray-100 p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Nutricionista
                    </p>
                    <p className="mt-1 text-lg font-bold text-gray-900">
                      {selecionado.nome}
                    </p>
                    <p className="text-sm text-gray-600">{selecionado.especialidade}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-gray-300 bg-gray-100 p-4 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Data
                      </p>
                      <p className="mt-1 font-bold text-gray-900">{formatarData(data)}</p>
                    </div>
                    <div className="rounded-2xl border border-gray-300 bg-gray-100 p-4 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Horário
                      </p>
                      <p className="mt-1 font-bold text-gray-900">{horario}</p>
                    </div>
                  </div>

                  <p className="flex items-center gap-2 rounded-2xl border border-green-200 bg-green-100 px-4 py-3 text-sm font-medium text-green-950">
                    <Check size={17} className="shrink-0 text-green-800" aria-hidden="true" />
                    Ficha de anamnese preenchida
                  </p>

                  <button
                    onClick={confirmar}
                    disabled={enviando}
                    className="w-full cursor-pointer rounded-xl bg-green-800 py-3 font-bold text-white shadow-sm transition hover:bg-green-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {enviando ? "Agendando..." : "Confirmar agendamento"}
                  </button>
                </div>
              </div>
              <Voltar onClick={() => setPasso(4)} />
            </section>
          )}

          {erro && (
            <p className="mt-6 max-w-md rounded-md bg-red-100 p-3 font-semibold text-red-700">{erro}</p>
          )}
        </>
      )}
      </main>
    </div>
  );
}

export default Agendamentos;
