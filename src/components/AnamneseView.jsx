const valorTexto = (valor) => {
  if (Array.isArray(valor)) return valor.join(", ") || "—";
  if (valor && typeof valor === "object") return JSON.stringify(valor);
  return valor || "—";
};

function AnamneseView({ anamnese: a }) {
  if (!a) return null;

  if (a.pesoKg !== undefined || a.adesaoPlano !== undefined) {
    const acompanhamento = a.adesaoPlano !== undefined;
    const grupos = acompanhamento
      ? [["Evolução desde a última consulta", [
          ["Peso atual", a.pesoKg ? `${a.pesoKg} kg` : "—"],
          ["Adesão às orientações", a.adesaoPlano],
          ["Dificuldades e facilitadores", a.dificuldades],
          ["Alterações de saúde", a.alteracoesSaude],
          ["Sintomas", a.sintomas],
        ]], ["Hábitos atuais", [
          ["Água e líquidos", a.aguaLitros],
          ["Atividade física", a.atividadeFisica],
          ["Sono, apetite e intestino", a.sonoApetiteIntestino],
          ["Mudanças alimentares", a.mudancasAlimentares],
          ["Observações", a.observacoes],
        ]]]
      : [["Medidas e objetivo", [
          ["Peso", a.pesoKg ? `${a.pesoKg} kg` : "—"],
          ["Altura", a.alturaCm ? `${a.alturaCm} cm` : "—"],
          ["Circunferência da cintura", a.medidaCinturaCm ? `${a.medidaCinturaCm} cm` : "—"],
          ["Objetivo", a.objetivoPrincipal],
        ]], ["Histórico de saúde", [
          ["Diagnósticos e condições", a.diagnosticos],
          ["Medicamentos", a.medicamentos],
          ["Suplementos", a.suplementos],
          ["Alergias", a.alergias],
          ["Restrições e intolerâncias", a.restricoesAlimentares],
          ["Antecedentes clínicos", a.historicoClinico],
          ["Histórico familiar", a.historicoFamiliar],
          ["Sintomas", a.sintomas],
        ]], ["Alimentação e rotina", [
          ["Recordatório alimentar", a.recordatorioAlimentar],
          ["Água e líquidos", a.aguaLitros],
          ["Atividade física", a.atividadeFisica],
          ["Sono", a.sono],
          ["Rotina", a.rotina],
          ["Relação com a alimentação", a.relacaoComAlimentacao],
        ]]];

    return (
      <div className="space-y-4">
        {grupos.map(([titulo, linhas]) => (
          <section key={titulo}>
            <h4 className="mb-1 text-sm font-bold text-gray-700">{titulo}</h4>
            <div className="space-y-1">
              {linhas.map(([rotulo, valor]) => (
                <div key={rotulo} className="rounded-lg bg-gray-100 px-3 py-2">
                  <p className="text-xs text-gray-500">{rotulo}</p>
                  <p className="whitespace-pre-wrap text-sm font-semibold text-gray-800">{valorTexto(valor)}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  }

  const grupos = [
    ["Medidas", [
      ["Peso corporal", a.pesoCorporal],
      ["Altura", a.altura],
      ["Peso ideal", a.pesoIdeal],
    ]],
    ["Saúde", [
      ["Patologias", [...(a.patologias || []), a.patologiaOutra].filter(Boolean).join(", ") || "Nenhuma"],
      ["Histórico familiar", [...(a.historicoFamiliar || []), a.familiarOutra].filter(Boolean).join(", ") || "Nenhuma"],
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
