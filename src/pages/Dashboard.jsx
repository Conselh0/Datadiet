import {
  ArrowRight,
  CalendarCheck2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Clock3,
  UserRound,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import consultas from "../data/consultas";
import pacientes from "../data/pacientes";

const nomesDosDias = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const nomesDosMeses = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];
const distribuicaoStatus = [
  { nome: "Confirmadas", percentual: 80, cor: "bg-emerald-500" },
  { nome: "Remarcadas", percentual: 15, cor: "bg-amber-400" },
  { nome: "Canceladas", percentual: 5, cor: "bg-rose-500" },
];

function chaveDaData(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

function dataDaConsulta(data) {
  const [ano, mes, dia] = data.split("-").map(Number);
  return new Date(ano, mes - 1, dia);
}

function iniciais(nome) {
  return nome
    .split(" ")
    .map((parte) => parte[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Dashboard() {
  const agora = new Date();
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const hojeIso = chaveDaData(hoje);

  const proximasConsultas = consultas
    .filter((consulta) => timestampDaConsulta(consulta) >= agora.getTime())
    .sort(
      (a, b) =>
        timestampDaConsulta(a) - timestampDaConsulta(b),
    );
  const consultasDeHoje = consultas.filter(
    (consulta) => consulta.data === hojeIso,
  );
  const confirmacoesPendentes = proximasConsultas.filter(
    (consulta) => consulta.status.toLocaleLowerCase("pt-BR") === "pendente",
  );
  const pacientesComRetorno = new Set(
    proximasConsultas.map((consulta) => consulta.pacienteId),
  );
  const pacientesSemRetorno = pacientes.filter(
    (paciente) => !pacientesComRetorno.has(paciente.id),
  );
  const proximaConsulta = proximasConsultas[0];
  const [mesVisivel, setMesVisivel] = useState(
    new Date(hoje.getFullYear(), hoje.getMonth(), 1),
  );
  const [dataSelecionada, setDataSelecionada] = useState(
    proximasConsultas[0] ? dataDaConsulta(proximasConsultas[0].data) : hoje,
  );

  const inicioDoMes = new Date(
    mesVisivel.getFullYear(),
    mesVisivel.getMonth(),
    1,
  );
  const deslocamentoInicio = (inicioDoMes.getDay() + 6) % 7;
  const quantidadeDias =
    Math.ceil(
      (deslocamentoInicio +
        new Date(
          mesVisivel.getFullYear(),
          mesVisivel.getMonth() + 1,
          0,
        ).getDate()) /
        7,
    ) * 7;
  const diasDoCalendario = Array.from({ length: quantidadeDias }, (_, indice) => {
    const dia = new Date(inicioDoMes);
    dia.setDate(indice - deslocamentoInicio + 1);
    return dia;
  });
  const consultasNaData = consultas.filter(
    (consulta) => consulta.data === chaveDaData(dataSelecionada),
  );
  const consultasRecentes = [...pacientes].sort(
    (a, b) => timestampDaData(b.data) - timestampDaData(a.data),
  );

  function mudarMes(direcao) {
    setMesVisivel(
      (mesAtual) =>
        new Date(mesAtual.getFullYear(), mesAtual.getMonth() + direcao, 1),
    );
  }

  function selecionarDia(dia) {
    setDataSelecionada(dia);
    if (dia.getMonth() !== mesVisivel.getMonth()) {
      setMesVisivel(new Date(dia.getFullYear(), dia.getMonth(), 1));
    }
  }

  return (
    <main className="min-h-screen w-full bg-gray-100 p-4 sm:p-6 lg:p-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
            Área administrativa
          </p>
          <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl">
            Dashboard
          </h1>
          <p className="mt-2 text-gray-500">
            Acompanhe seus pacientes e a agenda de consultas.
          </p>
        </header>

        <section
          aria-label="Resumo"
          className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <article className="flex items-center gap-5 rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-600">
              <Users size={28} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Pacientes cadastrados
              </p>
              <p className="mt-1 text-3xl font-bold text-gray-800">
                {pacientes.length}
              </p>
            </div>
            <Link
              to="/Admin/Pacientes"
              aria-label="Ver todos os pacientes"
              className="ml-auto rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
            >
              <ArrowRight size={20} aria-hidden="true" />
            </Link>
          </article>

          <article className="flex items-center gap-5 rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-600">
              <CalendarDays size={28} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Consultas hoje
              </p>
              <p className="mt-1 text-3xl font-bold text-gray-800">
                {consultasDeHoje.length}
              </p>
            </div>
            <Link
              to="/Admin/Agendamentos"
              aria-label="Ver agenda de consultas"
              className="ml-auto rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
            >
              <ArrowRight size={20} aria-hidden="true" />
            </Link>
          </article>

          <article className="flex items-center gap-5 rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
              <CircleAlert size={27} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Aguardando confirmação
              </p>
              <p className="mt-1 text-3xl font-bold text-gray-800">
                {confirmacoesPendentes.length}
              </p>
            </div>
            <Link
              to="/Admin/Agendamentos"
              aria-label="Ver consultas pendentes"
              className="ml-auto rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
            >
              <ArrowRight size={20} aria-hidden="true" />
            </Link>
          </article>

          <article className="flex items-center gap-5 rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-600">
              <UserRound size={27} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Sem retorno marcado
              </p>
              <p className="mt-1 text-3xl font-bold text-gray-800">
                {pacientesSemRetorno.length}
              </p>
            </div>
            <Link
              to="/Admin/Pacientes"
              aria-label="Ver pacientes sem retorno marcado"
              className="ml-auto rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
            >
              <ArrowRight size={20} aria-hidden="true" />
            </Link>
          </article>
        </section>

        <section
          aria-labelledby="status-consultas-titulo"
          className="mb-8 rounded-3xl bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="mb-5">
            <h2
              id="status-consultas-titulo"
              className="text-xl font-bold text-gray-800"
            >
              Status das consultas
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Distribuição ilustrativa dos atendimentos.
            </p>
          </div>

          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-12">
            <div
              role="img"
              aria-label="Gráfico de rosca: 80% confirmadas, 15% remarcadas e 5% canceladas"
              className="relative h-48 w-48 shrink-0 rounded-full"
              style={{
                background:
                  "conic-gradient(#10b981 0% 80%, #fbbf24 80% 95%, #f43f5e 95% 100%)",
              }}
            >
              <div className="absolute inset-5 flex flex-col items-center justify-center rounded-full bg-white">
                <span className="text-3xl font-bold text-gray-800">80%</span>
                <span className="mt-1 text-xs font-medium text-gray-500">
                  confirmadas
                </span>
                </div>
              </div>

            <ul
              aria-label="Legenda do status das consultas"
              className="grid w-full max-w-sm gap-3"
            >
              {distribuicaoStatus.map(({ nome, percentual, cor }) => (
                <li
                  key={nome}
                  className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3"
                >
                  <span className="flex items-center gap-3 text-sm font-medium text-gray-700">
                    <span
                      aria-hidden="true"
                      className={`h-3 w-3 rounded-full ${cor}`}
                    />
                    {nome}
                  </span>
                  <span className="text-sm font-bold text-gray-800">
                    {percentual}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          aria-label="Resumo da agenda"
          className="mb-8 grid items-start gap-5 lg:grid-cols-3"
        >
          <article className="rounded-3xl bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                <CalendarCheck2 size={21} aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-bold text-gray-800">Agenda de hoje</h2>
                <p className="text-xs text-gray-500">
                  {agora.toLocaleDateString("pt-BR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </p>
              </div>
            </div>
            {consultasDeHoje.length > 0 ? (
              <ul className="space-y-2">
                {consultasDeHoje.map((consulta) => (
                  <li key={consulta.id}>
                    <button
                      type="button"
                      onClick={() => selecionarDia(dataDaConsulta(consulta.data))}
                      className="flex w-full items-center gap-3 rounded-xl bg-gray-50 p-3 text-left transition hover:bg-gray-100"
                    >
                      <span className="text-sm font-bold text-gray-700">
                        {consulta.horario}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm text-gray-700">
                        {consulta.paciente}
                      </span>
                      <span className="text-xs text-gray-500">
                        {consulta.status}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-xl bg-gray-50 p-3 text-sm text-gray-500">
                Você não tem consultas restantes para hoje.
              </p>
            )}
          </article>

          <article className="rounded-3xl bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                  <CircleAlert size={21} aria-hidden="true" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-800">
                    Confirmações pendentes
                  </h2>
                  <p className="text-xs text-gray-500">
                    {confirmacoesPendentes.length} aguardando resposta
                  </p>
                </div>
              </div>
              <Link
                to="/Admin/Agendamentos"
                aria-label="Abrir agendamentos"
                className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
            {confirmacoesPendentes.length > 0 ? (
              <ul className="space-y-2">
                {confirmacoesPendentes.slice(0, 3).map((consulta) => (
                  <li
                    key={consulta.id}
                    className="flex items-center justify-between gap-3 rounded-xl bg-amber-50/70 p-3"
                  >
                    <span className="min-w-0 truncate text-sm font-medium text-gray-700">
                      {consulta.paciente}
                    </span>
                    <span className="shrink-0 text-xs text-amber-800">
                      {dataDaConsulta(consulta.data).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                      })}{" "}
                      · {consulta.horario}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-xl bg-gray-50 p-3 text-sm text-gray-500">
                Todas as consultas futuras estão confirmadas.
              </p>
            )}
          </article>

          <article className="rounded-3xl bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                  <Users size={21} aria-hidden="true" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-800">
                  Precisam de retorno
                  </h2>
                  <p className="text-xs text-gray-500">
                  Sem consulta futura marcada
                  </p>
                </div>
              </div>
              <Link
                to="/Admin/Pacientes"
                aria-label="Abrir lista de pacientes"
                className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
            {pacientesSemRetorno.length > 0 ? (
              <ul className="space-y-2">
                {pacientesSemRetorno.slice(0, 3).map((paciente) => (
                  <li
                    key={paciente.id}
                    className="flex items-center gap-3 rounded-xl bg-gray-50 p-3"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-gray-600">
                      {iniciais(paciente.nome)}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-700">
                      {paciente.nome}
                    </span>
                    <Link
                      to="/Admin/Pacientes"
                      aria-label={`Ver paciente ${paciente.nome}`}
                      className="rounded-full p-1 text-gray-400 transition hover:text-gray-700"
                    >
                      <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-xl bg-gray-50 p-3 text-sm text-gray-500">
                Todos os pacientes têm retorno marcado.
              </p>
            )}
          </article>
        </section>

        <section className="mb-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <div className="rounded-3xl bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Calendário</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Selecione um dia para ver os atendimentos.
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => mudarMes(-1)}
                  aria-label="Mês anterior"
                  className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100"
                >
                  <ChevronLeft size={20} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => mudarMes(1)}
                  aria-label="Próximo mês"
                  className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100"
                >
                  <ChevronRight size={20} aria-hidden="true" />
                </button>
              </div>
            </div>

            <p className="mb-4 text-center text-lg font-semibold capitalize text-gray-800">
              {nomesDosMeses[mesVisivel.getMonth()]} {mesVisivel.getFullYear()}
            </p>

            <div className="grid grid-cols-7 text-center">
              {nomesDosDias.map((dia) => (
                <div
                  key={dia}
                  className="pb-2 text-xs font-semibold uppercase text-gray-400"
                >
                  {dia}
                </div>
              ))}
              {diasDoCalendario.map((dia) => {
                const diaTemConsulta = consultas.some(
                  (consulta) => consulta.data === chaveDaData(dia),
                );
                const diaSelecionado =
                  chaveDaData(dia) === chaveDaData(dataSelecionada);
                const diaDoMesAtual = dia.getMonth() === mesVisivel.getMonth();

                return (
                  <button
                    key={chaveDaData(dia)}
                    type="button"
                    onClick={() => selecionarDia(dia)}
                    aria-label={`${dia.getDate()} de ${nomesDosMeses[dia.getMonth()]}${diaTemConsulta ? ", com consulta" : ""}`}
                    aria-pressed={diaSelecionado}
                    className={`relative mx-auto mb-1 flex h-10 w-10 items-center justify-center rounded-full text-sm transition sm:h-11 sm:w-11 ${
                      diaSelecionado
                        ? "bg-gray-700 font-semibold text-white"
                        : diaDoMesAtual
                          ? "text-gray-700 hover:bg-gray-100"
                          : "text-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {dia.getDate()}
                    {diaTemConsulta && (
                      <span
                        className={`absolute bottom-1 h-1.5 w-1.5 rounded-full ${
                          diaSelecionado ? "bg-white" : "bg-emerald-500"
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Dia com consulta
            </div>

            <div className="mt-5 border-t border-gray-100 pt-4">
              <h3 className="mb-3 text-sm font-semibold text-gray-700">
                Consultas em{" "}
                {dataSelecionada.toLocaleDateString("pt-BR", {
                  day: "numeric",
                  month: "long",
                })}
              </h3>
              {consultasNaData.length > 0 ? (
                <ul className="space-y-3">
                  {consultasNaData.map((consulta) => (
                    <li
                      key={consulta.id}
                      className="flex items-center justify-between gap-3 rounded-2xl bg-gray-50 p-3"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-gray-600">
                          {iniciais(consulta.paciente)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-800">
                            {consulta.paciente}
                          </p>
                          <p className="text-xs text-gray-500">
                            {consulta.status}
                          </p>
                        </div>
                      </div>
                      <span className="shrink-0 text-sm font-semibold text-gray-700">
                        {consulta.horario}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-500">
                  Nenhuma consulta agendada para este dia.
                </p>
              )}
            </div>
          </div>

          <section className="rounded-3xl bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Próximas consultas
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Seus próximos atendimentos agendados.
                </p>
              </div>
              <Link
                to="/Admin/Agendamentos"
                aria-label="Ver agenda completa"
                className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
              >
                <ArrowRight size={20} aria-hidden="true" />
              </Link>
            </div>

            {proximaConsulta && (
              <button
                type="button"
                onClick={() =>
                  selecionarDia(dataDaConsulta(proximaConsulta.data))
                }
                className="mb-4 flex w-full items-center gap-3 rounded-2xl bg-gray-800 p-4 text-left text-white transition hover:bg-gray-700"
              >
                <span className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-white/10">
                  <span className="text-lg font-bold leading-none">
                    {dataDaConsulta(proximaConsulta.data).getDate()}
                  </span>
                  <span className="mt-1 text-[10px] font-semibold uppercase">
                    {nomesDosMeses[
                      dataDaConsulta(proximaConsulta.data).getMonth()
                    ].slice(0, 3)}
                  </span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-gray-300">
                    Próximo atendimento · {proximaConsulta.horario}
                  </span>
                  <span className="mt-1 block truncate text-sm font-semibold">
                    {proximaConsulta.paciente}
                  </span>
                </span>
                <ChevronRight
                  size={18}
                  className="shrink-0 text-gray-300"
                  aria-hidden="true"
                />
              </button>
            )}

            {proximasConsultas.length > 0 ? (
              <ul className="space-y-3">
                {proximasConsultas.slice(proximaConsulta ? 1 : 0, 5).map((consulta) => {
                  const data = dataDaConsulta(consulta.data);
                  return (
                    <li key={consulta.id}>
                      <button
                        type="button"
                        onClick={() => selecionarDia(data)}
                        className="flex w-full items-center gap-3 rounded-2xl border border-gray-100 p-3 text-left transition hover:border-gray-200 hover:bg-gray-50"
                      >
                        <span className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                          <span className="text-lg font-bold leading-none">
                            {data.getDate()}
                          </span>
                          <span className="mt-1 text-[10px] font-semibold uppercase">
                            {nomesDosMeses[data.getMonth()].slice(0, 3)}
                          </span>
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-gray-800">
                            {consulta.paciente}
                          </span>
                          <span className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                            <Clock3 size={13} aria-hidden="true" />
                            {consulta.horario} · {consulta.status}
                          </span>
                        </span>
                        <ChevronRight
                          size={18}
                          className="shrink-0 text-gray-400"
                          aria-hidden="true"
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-500">
                Não há próximas consultas agendadas.
              </p>
            )}
          </section>
        </section>

        <section className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Histórico de consultas
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Últimas consultas registradas dos seus pacientes.
              </p>
            </div>
            <Link
              to="/Admin/Historico"
              className="inline-flex items-center gap-2 self-start text-sm font-semibold text-gray-600 transition hover:text-gray-900 sm:self-auto"
            >
              Ver histórico completo
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left">
              <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Atendimento</th>
                  <th className="px-6 py-4 font-semibold">Paciente</th>
                  <th className="px-6 py-4 font-semibold">Data e horário</th>
                  <th className="px-6 py-4 text-right font-semibold">
                    <span className="sr-only">Ação</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {consultasRecentes.map((consulta) => (
                    <tr
                      key={consulta.id}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-semibold text-gray-700">
                        #{consulta.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-600">
                            {iniciais(consulta.nome)}
                          </span>
                          <span className="font-medium text-gray-700">
                            {consulta.nome}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <span className="font-medium">{consulta.data}</span>
                        <span className="ml-2 text-sm text-gray-400">
                          {consulta.hora}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to="/Admin/Pacientes"
                          aria-label={`Ver pacientes, incluindo ${consulta.nome}`}
                          className="inline-flex rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                        >
                          <ArrowRight size={18} aria-hidden="true" />
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

function timestampDaData(data) {
  const [dia, mes, ano] = data.split("/").map(Number);
  return new Date(ano, mes - 1, dia).getTime();
}

function timestampDaConsulta(consulta) {
  const [ano, mes, dia] = consulta.data.split("-").map(Number);
  const [hora, minuto] = consulta.horario.split(":").map(Number);
  return new Date(ano, mes - 1, dia, hora, minuto).getTime();
}

export default Dashboard;
