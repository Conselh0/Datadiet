import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
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
    <ol className="mb-8 flex w-full max-w-xl items-start justify-between">
      {ETAPAS.map((nome, i) => {
        const n = i + 1;
        const feita = n < passo;
        const atual = n === passo;
        return (
          <li key={nome} className="flex flex-1 flex-col items-center">
            <div className="flex w-full items-center">
              <span className={`h-1 flex-1 ${i === 0 ? "invisible" : feita || atual ? "bg-green-600" : "bg-green-200"}`} />
              <button
                type="button"
                disabled={!feita}
                onClick={() => onIr(n)}
                aria-label={`Etapa ${n}: ${nome}`}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition ${
                  feita
                    ? "cursor-pointer bg-green-600 text-white hover:bg-green-700"
                    : atual
                    ? "bg-green-700 text-white ring-4 ring-green-300"
                    : "bg-white text-gray-400"
                }`}
              >
                {feita ? <Check size={18} /> : n}
              </button>
              <span className={`h-1 flex-1 ${i === ETAPAS.length - 1 ? "invisible" : feita ? "bg-green-600" : "bg-green-200"}`} />
            </div>
            <span className={`mt-1 hidden text-xs font-semibold sm:block ${atual ? "text-green-800" : "text-green-700/60"}`}>
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
    <div className="mb-5 text-center">
      <h2 className="text-2xl font-bold text-green-800 md:text-3xl">{texto}</h2>
      {detalhe && <p className="mt-1 text-green-900/70">{detalhe}</p>}
    </div>
  );
}

function Voltar({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-6 cursor-pointer font-semibold text-green-800 underline-offset-4 hover:underline"
    >
      ← Voltar
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
      await criarAgendamento({ nutricionistaId: selecionado._id, data, horario, anamnese, tipoAnamnese, anamneseId });
      setSucesso({ nutricionista: selecionado.nome, data, horario });
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
    <div className="flex min-h-screen w-full min-w-0 flex-col items-center bg-[url('/img/bolas.png')] bg-green-400/20 p-4 pb-16 text-center">
      <h1 className="my-8 text-3xl font-bold text-green-700 md:text-5xl">AGENDE SUA CONSULTA</h1>

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
          <Link
            to="/User/Historico"
            className="mt-6 block w-full rounded-lg bg-green-600 py-2 font-bold text-white hover:bg-green-700"
          >
            Ver minhas consultas
          </Link>
        </div>
      ) : emAndamento ? (
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
          <p className="text-2xl font-bold text-green-800">Você já tem uma consulta em andamento</p>
          <p className="mt-4 text-lg text-slate-700">
            {formatarData(emAndamento.data)} às {emAndamento.horario}
          </p>
          <p className="text-slate-600">com {emAndamento.nutricionista}</p>
          <p className="mt-4 text-sm text-gray-500">
            Você poderá agendar outra depois que ela for concluída ou o cancelamento for confirmado
            pelo nutricionista. Para mudar o horário, peça o reagendamento no histórico.
          </p>
          <Link
            to="/User/Historico"
            className="mt-6 block w-full rounded-lg bg-green-600 py-2 font-bold text-white hover:bg-green-700"
          >
            Ver minhas consultas
          </Link>
        </div>
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
              <Titulo texto="Confirme sua consulta" />
              <div className="w-full rounded-2xl bg-green-950 p-6 text-white shadow-xl">
                <p className="text-sm text-green-200">Nutricionista</p>
                <p className="text-xl font-bold">{selecionado.nome}</p>
                <p className="text-sm text-green-200">{selecionado.especialidade}</p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-green-900/60 p-3">
                    <p className="text-xs text-green-200">Data</p>
                    <p className="text-lg font-bold">{formatarData(data)}</p>
                  </div>
                  <div className="rounded-xl bg-green-900/60 p-3">
                    <p className="text-xs text-green-200">Horário</p>
                    <p className="text-lg font-bold">{horario}</p>
                  </div>
                </div>

                <p className="mt-4 flex items-center gap-2 text-sm text-green-200">
                  <Check size={16} /> Ficha de anamnese preenchida
                </p>

                <button
                  onClick={confirmar}
                  disabled={enviando}
                  className="mt-6 w-full cursor-pointer rounded-lg bg-green-400 py-3 font-bold text-green-950 hover:bg-green-300 disabled:opacity-60"
                >
                  {enviando ? "Agendando..." : "Confirmar agendamento"}
                </button>
              </div>
              <Voltar onClick={() => setPasso(4)} />
            </section>
          )}

          {erro && (
            <p className="mt-6 max-w-md rounded-md bg-red-100 p-3 font-semibold text-red-700">{erro}</p>
          )}
        </>
      )}
    </div>
  );
}

export default Agendamentos;
