import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import NutricionistaCard from "../components/NutricionistaCard";
import Calendario from "../components/Calendario";
import { listarNutricionistas, buscarHorarios } from "../services/nutricionistaService";
import { criarAgendamento, getUsuario } from "../services/agendamentoService";
import { formatarData } from "../utils/formatters";

const ETAPAS = ["Nutricionista", "Data", "Horário", "Confirmar"];

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
      className="mt-6 font-semibold text-green-800 underline-offset-4 hover:underline"
    >
      ← Voltar
    </button>
  );
}

function Agendamentos() {
  const [passo, setPasso] = useState(1);

  const [nutricionistas, setNutricionistas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroLista, setErroLista] = useState("");

  const [selecionado, setSelecionado] = useState(null);
  const [data, setData] = useState("");
  const [horarios, setHorarios] = useState([]);
  const [carregandoHorarios, setCarregandoHorarios] = useState(false);
  const [horario, setHorario] = useState("");

  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(null);

  useEffect(() => {
    listarNutricionistas()
      .then(setNutricionistas)
      .catch((e) => setErroLista(e.message))
      .finally(() => setCarregando(false));
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

  // Ao mudar nutricionista ou data, busca os horários daquele dia
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
    setPasso(4);
  };

  const confirmar = async () => {
    setErro("");
    if (!getUsuario().nome) {
      return setErro("Não foi possível identificar o paciente. Abra o seu perfil e tente novamente.");
    }
    try {
      setEnviando(true);
      await criarAgendamento({
        nutricionistaId: selecionado._id,
        data,
        horario,
      });
      setSucesso({ nutricionista: selecionado.nome, data, horario });
    } catch (e) {
      setErro(e.message);
      setHorario("");
      carregarHorarios(); // atualiza, caso o horário tenha sido ocupado
      setPasso(3);
    } finally {
      setEnviando(false);
    }
  };

  const recomecar = () => {
    setSucesso(null);
    setSelecionado(null);
    setData("");
    setHorario("");
    setErro("");
    setPasso(1);
  };

  const livres = horarios.filter((h) => h.livre).length;

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-[url('/img/bolas.png')] bg-green-400/20 p-4 pb-16 text-center">
      <h1 className="my-8 text-3xl font-bold text-green-700 md:text-5xl">AGENDE SUA CONSULTA</h1>

      {sucesso ? (
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
          <p className="text-2xl font-bold text-green-800">Consulta agendada!</p>
          <p className="mt-4 text-lg text-slate-700">
            {formatarData(sucesso.data)} às {sucesso.horario}
          </p>
          <p className="text-slate-600">com {sucesso.nutricionista}</p>
          <p className="mt-4 text-sm text-gray-500">
            O nutricionista vai confirmar o atendimento. Acompanhe o status em Histórico de consultas.
          </p>
          <button
            onClick={recomecar}
            className="mt-6 w-full rounded-lg bg-green-600 py-2 font-bold text-white hover:bg-green-700"
          >
            Agendar outra consulta
          </button>
        </div>
      ) : (
        <>

        {/* <section className="bg-white p-20 max-w-[90vw] rounded-4xl"> */}
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
            <section className="flex w-full max-w-2xl flex-col items-center">
              <Titulo
                texto="Escolha o horário"
                detalhe={`${selecionado.nome} · ${formatarData(data)}`}
              />
              <div className="w-full rounded-2xl bg-white p-5 shadow-lg">
                {carregandoHorarios ? (
                  <p className="text-gray-600">Buscando horários...</p>
                ) : livres === 0 ? (
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

          {/* Etapa 4: confirmação */}
          {passo === 4 && selecionado && data && horario && (
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

                <button
                  onClick={confirmar}
                  disabled={enviando}
                  className="mt-6 w-full rounded-lg bg-green-400 py-3 font-bold text-green-950 hover:bg-green-300 disabled:opacity-60"
                >
                  {enviando ? "Agendando..." : "Confirmar agendamento"}
                </button>
              </div>
              <Voltar onClick={() => setPasso(3)} />
            </section>
          )}
          {/* </section> */}
          {erro && (
            <p className="mt-6 max-w-md rounded-md bg-red-100 p-3 font-semibold text-red-700">{erro}</p>
          )}
        </>
      )}
    </div>
    
  );
}

export default Agendamentos;
