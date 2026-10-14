import { useState } from "react";

export const ANAMNESE_VAZIA = {
  pesoCorporal: "",
  altura: "",
  pesoIdeal: "",
  patologias: [],
  patologiaOutra: "",
  historicoFamiliar: [],
  familiarOutra: "",
  alergia: "",
  intolerancia: "",
  bebidaAlcoolica: "",
  fuma: "",
  atividadeFisica: "",
  funcionamentoIntestinal: "",
  desconfortoIntestinal: "",
  cansaco: "",
  aguaLitros: "",
  cafeDaManha: "",
  almoco: "",
  jantar: "",
  outraRefeicao: "",
};

const PATOLOGIAS = ["Diabete", "Hipertensão", "Gastrite", "Asma", "Bronquite"];
const FAMILIA = ["Diabete", "Hipertensão", "Doenças cardiovasculares", "Derrame", "Câncer"];

const PERGUNTAS = [
  ["bebidaAlcoolica", "Você consome bebida alcoólica?", ["Sim", "Não"]],
  ["fuma", "Você fuma?", ["Sim", "Não"]],
  ["atividadeFisica", "Você pratica alguma atividade física?", ["Sim", "Não"]],
  ["funcionamentoIntestinal", "Como é seu funcionamento intestinal?", ["Regular", "Irregular"]],
  ["desconfortoIntestinal", "Você sente desconforto intestinal ou dificuldade para ir ao banheiro?", ["Sim", "Não"]],
  ["cansaco", "Você costuma se sentir cansado ou desanimado frequentemente?", ["Sim", "Não"]],
];

const campo = "bg-white shadow-md rounded-lg w-full h-10 px-3";

function Grupo({ pergunta, children }) {
  return (
    <div className="mb-5">
      <p className="mb-1 font-semibold">{pergunta}</p>
      {children}
    </div>
  );
}

// <FormAnamnese inicial={...} onContinuar={(ficha) => ...} textoBotao="Continuar" />
function FormAnamnese({ inicial, onContinuar, textoBotao = "Continuar" }) {
  const [f, setF] = useState({ ...ANAMNESE_VAZIA, ...(inicial || {}) });

  const set = (nome) => (e) => setF({ ...f, [nome]: e.target.value });
  const alternar = (nome, valor) =>
    setF({
      ...f,
      [nome]: f[nome].includes(valor) ? f[nome].filter((v) => v !== valor) : [...f[nome], valor],
    });

  const Caixas = ({ nome, itens }) =>
    itens.map((item) => (
      <label key={item} className="flex items-center gap-2 py-0.5">
        <input type="checkbox" checked={f[nome].includes(item)} onChange={() => alternar(nome, item)} />
        {item}
      </label>
    ));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onContinuar(f);
      }}
      className="w-full max-w-2xl rounded-2xl bg-white/90 p-6 text-left shadow-lg"
    >
      <p className="mb-5 text-sm text-gray-600">
        A ficha é preenchida a cada consulta, para o nutricionista acompanhar a sua evolução.
      </p>

      <div className="grid gap-x-5 md:grid-cols-3">
        {[
          ["pesoCorporal", "Peso corporal:", "Ex.: 70 kg"],
          ["altura", "Altura:", "Ex.: 1,70 m"],
          ["pesoIdeal", "Peso ideal:", "Ex.: 65 kg"],
        ].map(([nome, rotulo, exemplo]) => (
          <Grupo key={nome} pergunta={rotulo}>
            <input className={campo} placeholder={exemplo} value={f[nome]} onChange={set(nome)} required />
          </Grupo>
        ))}
      </div>

      <Grupo pergunta="Você possui alguma das seguintes patologias?">
        <Caixas nome="patologias" itens={PATOLOGIAS} />
        <input className={`${campo} mt-2`} placeholder="Outra. Qual?" value={f.patologiaOutra} onChange={set("patologiaOutra")} />
      </Grupo>

      <Grupo pergunta="Você tem casos na família de alguma das seguintes patologias?">
        <Caixas nome="historicoFamiliar" itens={FAMILIA} />
        <input className={`${campo} mt-2`} placeholder="Outra. Qual?" value={f.familiarOutra} onChange={set("familiarOutra")} />
      </Grupo>

      <Grupo pergunta="Possui alergia a algum alimento? Se sim, qual?">
        <input className={campo} placeholder="Digite aqui" value={f.alergia} onChange={set("alergia")} />
      </Grupo>

      <Grupo pergunta="Possui intolerância a algum alimento? Se sim, qual?">
        <input className={campo} placeholder="Digite aqui" value={f.intolerancia} onChange={set("intolerancia")} />
      </Grupo>

      {PERGUNTAS.map(([nome, texto, opcoes]) => (
        <Grupo key={nome} pergunta={texto}>
          <div className="flex gap-6">
            {opcoes.map((o) => (
              <label key={o} className="flex items-center gap-2">
                <input type="radio" name={nome} value={o} checked={f[nome] === o} onChange={set(nome)} required />
                {o}
              </label>
            ))}
          </div>
        </Grupo>
      ))}

      <Grupo pergunta="Quantos litros de água você consome diariamente?">
        <input className={campo} placeholder="Exemplo: 2 litros" value={f.aguaLitros} onChange={set("aguaLitros")} required />
      </Grupo>

      {[
        ["cafeDaManha", "Descreva o seu café da manhã:", "Exemplo: 1 pão, 2 ovos..."],
        ["almoco", "Descreva o seu almoço:", "Exemplo: arroz, feijão, filé de frango..."],
        ["jantar", "Descreva o seu jantar:", "Exemplo: macarrão, carne moída..."],
        ["outraRefeicao", "Você realiza outra refeição? Se sim, descreva:", "No café da tarde eu como..."],
      ].map(([nome, rotulo, exemplo]) => (
        <Grupo key={nome} pergunta={rotulo}>
          <input className={campo} placeholder={exemplo} value={f[nome]} onChange={set(nome)} />
        </Grupo>
      ))}

      <button className="mt-2 h-11 w-full cursor-pointer rounded-lg bg-green-600 font-bold text-white hover:bg-green-700">
        {textoBotao}
      </button>
    </form>
  );
}

export default FormAnamnese;
