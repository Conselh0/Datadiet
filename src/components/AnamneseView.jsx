const lista = (itens = [], outra = "") =>
  [...itens, outra].filter(Boolean).join(", ") || "Nenhuma";

function AnamneseView({ anamnese: a }) {
  if (!a) return null;

  const grupos = [
    ["Medidas", [
      ["Peso corporal", a.pesoCorporal],
      ["Altura", a.altura],
      ["Peso ideal", a.pesoIdeal],
    ]],
    ["Saúde", [
      ["Patologias", lista(a.patologias, a.patologiaOutra)],
      ["Histórico familiar", lista(a.historicoFamiliar, a.familiarOutra)],
      ["Alergias", a.alergia || "Nenhuma informada"],
      ["Intolerâncias", a.intolerancia || "Nenhuma informada"],
    ]],
    ["Hábitos", [
      ["Consome bebida alcoólica", a.bebidaAlcoolica],
      ["Fuma", a.fuma],
      ["Pratica atividade física", a.atividadeFisica],
      ["Funcionamento intestinal", a.funcionamentoIntestinal],
      ["Desconforto intestinal", a.desconfortoIntestinal],
      ["Cansaço frequente", a.cansaco],
    ]],
    ["Alimentação", [
      ["Água por dia", a.aguaLitros],
      ["Café da manhã", a.cafeDaManha],
      ["Almoço", a.almoco],
      ["Jantar", a.jantar],
      ["Outra refeição", a.outraRefeicao],
    ]],
  ];

  return (
    <div className="space-y-4">
      {grupos.map(([titulo, linhas]) => (
        <section key={titulo}>
          <h4 className="mb-1 text-sm font-bold text-gray-700">{titulo}</h4>
          <div className="space-y-1">
            {linhas.map(([rotulo, valor]) => (
              <div key={rotulo} className="rounded-lg bg-gray-100 px-3 py-2">
                <p className="text-xs text-gray-500">{rotulo}</p>
                <p className="text-sm font-semibold text-gray-800">{valor || "—"}</p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default AnamneseView;
