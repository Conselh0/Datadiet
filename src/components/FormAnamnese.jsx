import { useState } from "react";

const DADOS_INICIAIS = {
  pesoKg: "", alturaCm: "", medidaCinturaCm: "", objetivoPrincipal: "", objetivoOutro: "",
  diagnosticos: [], diagnosticoOutro: "", medicamentos: [], medicamentosDetalhe: "",
  suplementos: [], suplementosDetalhe: "", alergias: [], alergiaOutra: "",
  restricoesAlimentares: [], historicoFamiliar: [], historicoFamiliarOutro: "",
  sintomas: [], refeicoesHabituais: [], alimentosFrequentes: [], aguaLitros: "",
  atividadeFisica: "", frequenciaAtividade: "", sono: "", bebidaAlcoolica: "",
  tabagismo: "", relacaoComAlimentacao: "",
};

const DADOS_ACOMPANHAMENTO = {
  pesoKg: "", adesaoPlano: "", dificuldades: [], alteracoesSaude: [],
  alteracoesSaudeDetalhe: "", sintomas: [], aguaLitros: "", atividadeFisica: "",
  frequenciaAtividade: "", sono: "", funcionamentoIntestinal: "",
  mudancasAlimentares: [], observacoes: "",
};

const OPACOES = {
  objetivos: ["Reduzir peso", "Ganhar massa", "Melhorar exames", "Saúde digestiva", "Organizar rotina", "Outro"],
  diagnosticos: ["Nenhum conhecido", "Diabetes", "Hipertensão", "Colesterol/triglicerídeos", "Condição gastrointestinal", "Tireoide", "Doença renal", "Outro"],
  medicamentos: ["Não uso", "Uso contínuo", "Uso eventual"],
  suplementos: ["Não utilizo", "Vitaminas/minerais", "Proteína", "Creatina", "Outro"],
  alergias: ["Não tenho", "Leite/lactose", "Glúten/trigo", "Amendoim/oleaginosas", "Ovo", "Peixes/frutos do mar", "Outra"],
  restricoes: ["Nenhuma", "Vegetariana/vegana", "Sem lactose", "Sem glúten", "Religiosa/cultural", "Outra"],
  historicoFamiliar: ["Nenhum conhecido", "Diabetes", "Hipertensão", "Obesidade", "Doença cardiovascular", "Outro"],
  sintomas: ["Nenhum", "Azia/refluxo", "Dor abdominal", "Inchaço/gases", "Náusea", "Constipação", "Diarreia"],
  refeicoes: ["Café da manhã", "Almoço", "Jantar", "Lanches", "Ceia"],
  alimentos: ["Frutas", "Verduras/legumes", "Feijão/leguminosas", "Carnes/ovos", "Leite/laticínios", "Doces", "Ultraprocessados"],
  agua: ["Menos de 1 L", "1 a 1,5 L", "1,5 a 2 L", "Mais de 2 L", "Não sei informar"],
  frequenciaAtividade: ["Não pratico", "1 a 2 vezes/semana", "3 a 4 vezes/semana", "5 ou mais vezes/semana"],
  sono: ["Menos de 5 h", "5 a 6 h", "7 a 8 h", "Mais de 8 h"],
  bebidaAlcoolica: ["Não consumo", "Raramente", "1 a 2 vezes/semana", "3 ou mais vezes/semana"],
  tabagismo: ["Não", "Sim", "Parei de fumar"],
  relacaoComAlimentacao: ["Tranquila", "Ansiedade/culpa frequente", "Perda de controle ocasional", "Prefiro conversar"],
  adesaoPlano: ["Na maior parte", "Parcialmente", "Tive dificuldade", "Sem orientações"],
  dificuldades: ["Sem dificuldades", "Tempo/rotina", "Fome/saciedade", "Custo/acesso", "Eventos sociais", "Orientações", "Outra"],
  alteracoesSaude: ["Sem alterações", "Novo diagnóstico", "Mudança de medicamento", "Novo suplemento", "Alergia/intolerância", "Outra"],
  evolucaoSintomas: ["Sem sintomas", "Melhoraram", "Sem mudança", "Pioraram", "Novos sintomas"],
  atividadeEvolucao: ["Não pratico", "Mantive", "Aumentei", "Reduzi"],
  intestino: ["Regular", "Constipação", "Diarreia", "Alternando", "Outro"],
  mudancasAlimentares: ["Sem mudança", "Mais frutas/verduras", "Menos ultraprocessados", "Novos horários", "Dificuldade", "Outra"],
};

const inputClass = "mt-1 w-full min-w-0 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100";
const EXCLUSIVAS = ["Nenhum conhecido", "Não uso", "Não utilizo", "Não tenho", "Nenhuma", "Nenhum", "Não consumo", "Sem dificuldades", "Sem alterações", "Sem sintomas", "Não pratico", "Sem mudança"];

function Grupo({ titulo, opcoes, valor = [], onChange, obrigatorio = false }) {
  const alternar = (opcao) => {
    const atual = Array.isArray(valor) ? valor : [];
    const exclusivo = EXCLUSIVAS.includes(opcao);
    const semExclusivas = atual.filter((item) => !EXCLUSIVAS.includes(item));
    onChange(exclusivo
      ? atual.includes(opcao) ? [] : [opcao]
      : atual.includes(opcao) ? atual.filter((item) => item !== opcao) : [...semExclusivas, opcao]);
  };

  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-sm font-semibold text-gray-800">
        {titulo}{obrigatorio && <span className="text-red-600"> *</span>}
      </legend>
      <div className="grid min-w-0 grid-cols-2 gap-1.5 sm:grid-cols-3">
        {opcoes.map((opcao) => {
          const selecionada = Array.isArray(valor) && valor.includes(opcao);
          return (
            <label key={opcao} className={`flex min-w-0 cursor-pointer items-center gap-2 rounded-xl border px-2 py-2 text-[11px] transition sm:text-xs ${selecionada ? "border-green-700 bg-green-100 text-green-950 shadow-sm" : "border-gray-200 bg-white text-gray-700 hover:border-green-500"}`}>
              <input type="checkbox" checked={selecionada} onChange={() => alternar(opcao)} className="shrink-0 accent-green-700" />
              <span className="line-clamp-2 break-words leading-tight">{opcao}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function Escolha({ titulo, opcoes, valor, onChange, obrigatorio = false }) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-sm font-semibold text-gray-800">
        {titulo}{obrigatorio && <span className="text-red-600"> *</span>}
      </legend>
      <div className="grid min-w-0 grid-cols-2 gap-1.5 sm:grid-cols-3">
        {opcoes.map((opcao) => (
          <label key={opcao} className={`flex min-w-0 cursor-pointer items-center gap-2 rounded-xl border px-2 py-2 text-[11px] transition sm:text-xs ${valor === opcao ? "border-green-700 bg-green-100 text-green-950 shadow-sm" : "border-gray-200 bg-white text-gray-700 hover:border-green-500"}`}>
            <input type="radio" name={titulo} value={opcao} checked={valor === opcao} onChange={() => onChange(opcao)} className="shrink-0 accent-green-700" />
            <span className="line-clamp-2 break-words leading-tight">{opcao}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Medida({ titulo, valor, onChange, obrigatorio = false }) {
  return (
    <label className="block min-w-0 text-sm font-semibold text-gray-800">
      {titulo}{obrigatorio && <span className="text-red-600"> *</span>}
      <input className={inputClass} type="number" min="1" step="0.1" value={valor} onChange={(evento) => onChange(evento.target.value)} required={obrigatorio} />
    </label>
  );
}

function Detalhe({ titulo, valor, onChange }) {
  return (
    <label className="block min-w-0 text-sm font-medium text-gray-700">
      {titulo}
      <input className={inputClass} type="text" maxLength={120} value={valor} onChange={(evento) => onChange(evento.target.value)} />
    </label>
  );
}

function Secao({ titulo, children }) {
  return (
    <section className="min-w-0 border-t border-gray-200 pt-4 first:border-0 first:pt-0">
      <h3 className="mb-3 text-base font-bold text-green-900">{titulo}</h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function FormAnamnese({ tipo = "inicial", inicial, onContinuar, textoBotao = "Continuar" }) {
  const inicialCompleta = tipo === "inicial";
  const vazios = inicialCompleta ? DADOS_INICIAIS : DADOS_ACOMPANHAMENTO;
  const [f, setF] = useState(() => ({ ...vazios, ...(inicial || {}) }));
  const [erro, setErro] = useState("");
  const alterar = (nome) => (valor) => setF((atual) => ({ ...atual, [nome]: valor }));
  const temOpcao = (nome) => Array.isArray(f[nome]) && f[nome].length > 0;

  const enviar = (evento) => {
    evento.preventDefault();
    const obrigatorios = inicialCompleta
      ? ["objetivoPrincipal", "diagnosticos", "medicamentos", "alergias", "refeicoesHabituais", "aguaLitros", "atividadeFisica", "sono"]
      : ["adesaoPlano", "dificuldades", "alteracoesSaude", "sintomas", "aguaLitros", "atividadeFisica", "sono", "funcionamentoIntestinal"];
    if (obrigatorios.some((nome) => Array.isArray(f[nome]) ? !temOpcao(nome) : !f[nome])) {
      setErro("Marque uma opção em cada pergunta obrigatória.");
      return;
    }
    setErro("");
    onContinuar(f);
  };

  return (
    <form onSubmit={enviar} className="w-full min-w-0 max-w-3xl space-y-3 rounded-xl bg-white p-3 text-left shadow-lg sm:p-5">
      <div className="rounded-2xl border border-green-100 bg-green-50 px-3 py-2 text-xs text-green-900 sm:text-sm">
        <span className="font-semibold">Checklist rápido:</span> marque o que se aplica e siga para o próximo passo.
      </div>
      <p className="text-xs text-gray-600"><span className="text-red-600">*</span> Campos obrigatórios.</p>

      {inicialCompleta ? (
        <>
          <Secao titulo="Medidas e objetivo">
            <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-3">
              <Medida titulo="Peso (kg)" valor={f.pesoKg} onChange={alterar("pesoKg")} obrigatorio />
              <Medida titulo="Altura (cm)" valor={f.alturaCm} onChange={alterar("alturaCm")} obrigatorio />
              <Medida titulo="Cintura (cm)" valor={f.medidaCinturaCm} onChange={alterar("medidaCinturaCm")} />
            </div>
            <Escolha titulo="Objetivo principal" opcoes={OPACOES.objetivos} valor={f.objetivoPrincipal} onChange={alterar("objetivoPrincipal")} obrigatorio />
            {f.objetivoPrincipal === "Outro" && <Detalhe titulo="Qual objetivo?" valor={f.objetivoOutro} onChange={alterar("objetivoOutro")} />}
          </Secao>

          <Secao titulo="Saúde">
            <Grupo titulo="Diagnósticos" opcoes={OPACOES.diagnosticos} valor={f.diagnosticos} onChange={alterar("diagnosticos")} obrigatorio />
            {f.diagnosticos.includes("Outro") && <Detalhe titulo="Qual diagnóstico?" valor={f.diagnosticoOutro} onChange={alterar("diagnosticoOutro")} />}
            <Grupo titulo="Medicamentos" opcoes={OPACOES.medicamentos} valor={f.medicamentos} onChange={alterar("medicamentos")} obrigatorio />
            {f.medicamentos.some((item) => item !== "Não uso") && <Detalhe titulo="Nome e dose (opcional)" valor={f.medicamentosDetalhe} onChange={alterar("medicamentosDetalhe")} />}
            <Grupo titulo="Alergias/intolerâncias" opcoes={OPACOES.alergias} valor={f.alergias} onChange={alterar("alergias")} obrigatorio />
            {f.alergias.includes("Outra") && <Detalhe titulo="Qual?" valor={f.alergiaOutra} onChange={alterar("alergiaOutra")} />}
            <Grupo titulo="Sintomas atuais" opcoes={OPACOES.sintomas} valor={f.sintomas} onChange={alterar("sintomas")} />
          </Secao>

          <Secao titulo="Alimentação e rotina">
            <Grupo titulo="Refeições habituais" opcoes={OPACOES.refeicoes} valor={f.refeicoesHabituais} onChange={alterar("refeicoesHabituais")} obrigatorio />
            <Escolha titulo="Água por dia" opcoes={OPACOES.agua} valor={f.aguaLitros} onChange={alterar("aguaLitros")} obrigatorio />
            <Escolha titulo="Atividade física" opcoes={["Não pratico", "Leve", "Moderada", "Intensa"]} valor={f.atividadeFisica} onChange={alterar("atividadeFisica")} obrigatorio />
            <Escolha titulo="Sono por noite" opcoes={OPACOES.sono} valor={f.sono} onChange={alterar("sono")} obrigatorio />
          </Secao>

          <details className="group min-w-0 border-t border-gray-200 pt-3">
            <summary className="cursor-pointer text-sm font-semibold text-green-900 marker:text-green-700">
              Informações complementares (opcional)
            </summary>
            <div className="mt-4 space-y-4">
              <Grupo titulo="Suplementos" opcoes={OPACOES.suplementos} valor={f.suplementos} onChange={alterar("suplementos")} />
              {f.suplementos.some((item) => item !== "Não utilizo") && <Detalhe titulo="Quais suplementos?" valor={f.suplementosDetalhe} onChange={alterar("suplementosDetalhe")} />}
              <Grupo titulo="Restrições alimentares" opcoes={OPACOES.restricoes} valor={f.restricoesAlimentares} onChange={alterar("restricoesAlimentares")} />
              <Grupo titulo="Histórico familiar" opcoes={OPACOES.historicoFamiliar} valor={f.historicoFamiliar} onChange={alterar("historicoFamiliar")} />
              {f.historicoFamiliar.includes("Outro") && <Detalhe titulo="Qual condição?" valor={f.historicoFamiliarOutro} onChange={alterar("historicoFamiliarOutro")} />}
              <Grupo titulo="Alimentos frequentes" opcoes={OPACOES.alimentos} valor={f.alimentosFrequentes} onChange={alterar("alimentosFrequentes")} />
              <Escolha titulo="Frequência de atividade" opcoes={OPACOES.frequenciaAtividade} valor={f.frequenciaAtividade} onChange={alterar("frequenciaAtividade")} />
              <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
                <Escolha titulo="Consumo de álcool" opcoes={OPACOES.bebidaAlcoolica} valor={f.bebidaAlcoolica} onChange={alterar("bebidaAlcoolica")} />
                <Escolha titulo="Tabagismo" opcoes={OPACOES.tabagismo} valor={f.tabagismo} onChange={alterar("tabagismo")} />
              </div>
              <Escolha titulo="Relação com alimentação" opcoes={OPACOES.relacaoComAlimentacao} valor={f.relacaoComAlimentacao} onChange={alterar("relacaoComAlimentacao")} />
            </div>
          </details>
        </>
      ) : (
        <>
          <Secao titulo="Desde a última consulta">
            <Medida titulo="Peso atual (kg)" valor={f.pesoKg} onChange={alterar("pesoKg")} obrigatorio />
            <Escolha titulo="Seguiu as orientações?" opcoes={OPACOES.adesaoPlano} valor={f.adesaoPlano} onChange={alterar("adesaoPlano")} obrigatorio />
            <Grupo titulo="Dificuldades" opcoes={OPACOES.dificuldades} valor={f.dificuldades} onChange={alterar("dificuldades")} obrigatorio />
            <Grupo titulo="Mudanças de saúde" opcoes={OPACOES.alteracoesSaude} valor={f.alteracoesSaude} onChange={alterar("alteracoesSaude")} obrigatorio />
            {f.alteracoesSaude.some((item) => item !== "Sem alterações") && <Detalhe titulo="Qual mudança?" valor={f.alteracoesSaudeDetalhe} onChange={alterar("alteracoesSaudeDetalhe")} />}
            <Escolha titulo="Sintomas" opcoes={OPACOES.evolucaoSintomas} valor={f.sintomas} onChange={alterar("sintomas")} obrigatorio />
          </Secao>
          <Secao titulo="Hábitos atuais">
            <Escolha titulo="Água por dia" opcoes={OPACOES.agua} valor={f.aguaLitros} onChange={alterar("aguaLitros")} obrigatorio />
            <Escolha titulo="Atividade física" opcoes={OPACOES.atividadeEvolucao} valor={f.atividadeFisica} onChange={alterar("atividadeFisica")} obrigatorio />
            <Escolha titulo="Frequência semanal" opcoes={OPACOES.frequenciaAtividade} valor={f.frequenciaAtividade} onChange={alterar("frequenciaAtividade")} />
            <Escolha titulo="Sono" opcoes={["Melhorou", "Sem mudança", "Piorou"]} valor={f.sono} onChange={alterar("sono")} obrigatorio />
            <Escolha titulo="Funcionamento intestinal" opcoes={OPACOES.intestino} valor={f.funcionamentoIntestinal} onChange={alterar("funcionamentoIntestinal")} obrigatorio />
            <Grupo titulo="Mudanças na alimentação" opcoes={OPACOES.mudancasAlimentares} valor={f.mudancasAlimentares} onChange={alterar("mudancasAlimentares")} />
            {f.mudancasAlimentares.includes("Outra") && <Detalhe titulo="Qual mudança?" valor={f.observacoes} onChange={alterar("observacoes")} />}
          </Secao>
        </>
      )}

      {erro && <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{erro}</p>}
      <button type="submit" className="h-11 w-full cursor-pointer rounded-xl bg-green-700 font-bold text-white shadow-sm transition hover:bg-green-800">
        {textoBotao}
      </button>
    </form>
  );
}

export default FormAnamnese;