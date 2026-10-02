import { useEffect, useRef, useState } from "react";
import NutricionistaCard from "../components/NutricionistaCard.jsx";
import Calendario from "../components/Calendario.jsx";
import { listarNutricionistas, buscarHorarios } from "../services/nutricionistaService.js";
import { criarAgendamento, getUsuario } from "../services/agendamentoService.js";
import { formatarData } from "../utils/formatters.js";


function Titulo({ numero, texto }) {
  return (
    <h2 className="mb-4 flex items-center justify-center gap-3 text-xl font-bold text-green-800 md:text-2xl">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-700 text-base text-white">
        {numero}
      </span>
      {texto}
    </h2>
  );
}

function Agendamentos() {
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

  const calendarioRef = useRef(null);
  const horariosRef = useRef(null);

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

  // Ao escolher nutricionista e data, busca os horários daquele dia
  useEffect(() => {
    setHorario("");
    setHorarios([]);
    carregarHorarios();
  }, [selecionado, data]);

  // Leva a pessoa para a próxima etapa
  useEffect(() => {
    if (selecionado) calendarioRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [selecionado]);
  useEffect(() => {
    if (data) horariosRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [data]);

  const escolherNutricionista = (n) => {
    setSelecionado(n);
    setData("");
    setErro("");
  };

  const confirmar = async () => {
    setErro("");
    const usuario = getUsuario();
    if (!usuario.nome) {
      return setErro("Não foi possível identificar o paciente. Abra o seu perfil e tente novamente.");
    }
    try {
      setEnviando(true);
      await criarAgendamento({
        paciente: usuario.nome,
        pacienteId: usuario.id,
        nutricionistaId: selecionado._id,
        data,
        horario,
      });
      setSucesso({ nutricionista: selecionado.nome, data, horario });
    } catch (e) {
      setErro(e.message);
      setHorario("");
      carregarHorarios(); // atualiza, caso o horário tenha sido ocupado
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
          {/* Etapa 1: nutricionista */}
          <section className="w-full max-w-5xl">
            <Titulo numero={1} texto="Escolha o nutricionista" />
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

          {/* Etapa 2: data */}
          {selecionado && (
            <section ref={calendarioRef} className="mt-12 flex w-full scroll-mt-6 flex-col items-center">
              <Titulo numero={2} texto="Escolha a data" />
              <Calendario
                key={selecionado._id}
                value={data}
                onChange={setData}
                diasAtendimento={selecionado.diasAtendimento}
              />
            </section>
          )}

          {/* Etapa 3: horário */}
          {selecionado && data && (
            <section ref={horariosRef} className="mt-12 w-full max-w-2xl scroll-mt-6">
              <Titulo numero={3} texto="Escolha o horário" />
              <div className="rounded-2xl bg-white p-5 shadow-lg">
                {carregandoHorarios ? (
                  <p className="text-gray-600">Buscando horários...</p>
                ) : livres === 0 ? (
                  <p className="text-gray-600">
                    Não há horários livres nesse dia. Escolha outra data no calendário.
                  </p>
                ) : (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
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
            </section>
          )}

          {/* Resumo e confirmação */}
          {selecionado && data && horario && (
            <section className="mt-8 w-full max-w-md rounded-2xl bg-green-950 p-6 text-white shadow-xl">
              <p className="text-sm text-green-200">Sua consulta</p>
              <p className="mt-1 text-xl font-bold">{selecionado.nome}</p>
              <p className="text-lg">
                {formatarData(data)} às {horario}
              </p>

              {erro && (
                <p className="mt-4 rounded-md bg-red-100 p-3 text-sm font-semibold text-red-700">
                  {erro}
                </p>
              )}

              <button
                onClick={confirmar}
                disabled={enviando}
                className="mt-5 w-full rounded-lg bg-green-400 py-3 font-bold text-green-950 hover:bg-green-300 disabled:opacity-60"
              >
                {enviando ? "Agendando..." : "Confirmar agendamento"}
              </button>
            </section>
          )}

          {/* Erro quando ainda não há resumo */}
          {erro && !(selecionado && data && horario) && (
            <p className="mt-6 rounded-md bg-red-100 p-3 font-semibold text-red-700">{erro}</p>
          )}
        </>
      )}
    </div>
  );
}

export default Agendamentos;
