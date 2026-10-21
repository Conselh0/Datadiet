import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

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

function obterDataInicial(dataInicial, consultas) {
  if (dataInicial) return dataDaConsulta(dataInicial);

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const agora = new Date();
  const proximaConsulta = consultas
    .filter((consulta) => {
      const [ano, mes, dia] = consulta.data.split("-").map(Number);
      const [hora, minuto] = consulta.horario.split(":").map(Number);
      return new Date(ano, mes - 1, dia, hora, minuto) >= agora;
    })
    .sort((a, b) => {
      const timestamp = (consulta) => {
        const [ano, mes, dia] = consulta.data.split("-").map(Number);
        const [hora, minuto] = consulta.horario.split(":").map(Number);
        return new Date(ano, mes - 1, dia, hora, minuto).getTime();
      };
      return timestamp(a) - timestamp(b);
    })[0];

  return proximaConsulta ? dataDaConsulta(proximaConsulta.data) : hoje;
}

function CalendarioConsultas({
  consultas = [],
  dataInicial,
  expandido = false,
  className = "",
}) {
  const [dataSelecionada, setDataSelecionada] = useState(() =>
    obterDataInicial(dataInicial, consultas),
  );
  const [mesVisivel, setMesVisivel] = useState(() => {
    const data = obterDataInicial(dataInicial, consultas);
    return new Date(data.getFullYear(), data.getMonth(), 1);
  });

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
  const diasDoCalendario = Array.from(
    { length: quantidadeDias },
    (_, indice) => {
      const dia = new Date(inicioDoMes);
      dia.setDate(indice - deslocamentoInicio + 1);
      return dia;
    },
  );
  const consultasNaData = consultas.filter(
    (consulta) => consulta.data === chaveDaData(dataSelecionada),
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
    <section
      className={`rounded-3xl bg-white p-5 shadow-sm sm:p-6 ${className}`}
    >
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Agenda do mês</h2>
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
              className={`relative mx-auto mb-1 flex ${
                expandido ? "h-12 w-12 sm:h-16 sm:w-16" : "h-10 w-10 sm:h-11 sm:w-11"
              } items-center justify-center rounded-full text-sm transition ${
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
                    <p className="text-xs text-gray-500">{consulta.status}</p>
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
    </section>
  );
}

export default CalendarioConsultas;
