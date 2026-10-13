import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { cadastrarNutricionista } from "../services/nutricionistaService";
import { getSessao, iniciarSessao } from "../utils/sessao";
import "../index.css";

const DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const VAZIO = {
  nome: "",
  sobrenome: "",
  nascimento: "",
  email: "",
  senha: "",
  confirmarSenha: "",
  cpf: "",
  crn: "",
  telefone: "",
  genero: "",
  especialidade: "",
  foto: "",
  diasAtendimento: [1, 2, 3, 4, 5],
  horaInicio: "08:00",
  horaFim: "17:00",
  duracao: "30",
};

const mascaraCPF = (v) =>
  v
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

const mascaraTelefone = (v) => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

const estiloInput = "bg-white shadow-md rounded-lg w-full h-10 px-3";
const estiloLabel = "text-base sm:text-lg font-medium mb-1";

function Campo({ id, label, className = "", ...props }) {
  return (
    <div className={`flex flex-col ${className}`}>
      <label htmlFor={id} className={estiloLabel}>
        {label}
      </label>
      <input id={id} className={estiloInput} {...props} />
    </div>
  );
}

function CadNu() {
  const navigate = useNavigate();
  const [form, setForm] = useState(VAZIO);
  const [enviando, setEnviando] = useState(false);
  const [msg, setMsg] = useState({ tipo: "", texto: "" });

  const mudar = (campo, formatar) => (e) =>
    setForm({ ...form, [campo]: formatar ? formatar(e.target.value) : e.target.value });

  const alternarDia = (dia) =>
    setForm({
      ...form,
      diasAtendimento: form.diasAtendimento.includes(dia)
        ? form.diasAtendimento.filter((d) => d !== dia)
        : [...form.diasAtendimento, dia].sort(),
    });

  const enviar = async (e) => {
    e.preventDefault();
    setMsg({ tipo: "", texto: "" });

    if (form.senha !== form.confirmarSenha) {
      return setMsg({ tipo: "erro", texto: "As senhas não conferem." });
    }
    if (form.diasAtendimento.length === 0) {
      return setMsg({ tipo: "erro", texto: "Escolha ao menos um dia de atendimento." });
    }

    try {
      setEnviando(true);
      const r = await cadastrarNutricionista({ ...form, duracao: Number(form.duracao) });
      // Quem se cadastra sozinho já entra na conta. Se já houver alguém logado
      // (ex.: nutricionista cadastrando um colega), a sessão atual é mantida.
      if (!getSessao()) iniciarSessao("nutricionista", r.nutricionista);
      setMsg({ tipo: "ok", texto: r.mensagem });
      setForm(VAZIO);
      setTimeout(() => navigate("/Admin"), 1500);
    } catch (err) {
      setMsg({ tipo: "erro", texto: err.message });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className="font-poppins bg-orange-50/50 bg-full flex items-center justify-center bg-[url('./img/bolas.png')] min-h-screen py-8 px-4">
      <section className="w-full max-w-2xl p-6 rounded-2xl bg-taupe-50/70 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold">Criar conta de nutricionista</h2>
          <Link to="/">
            <LogIn
              color="#ffffff"
              className="cursor-pointer h-10 w-12 sm:h-10 sm:w-12 p-2 bg-green-700 rounded-xl sm:rounded-xl transition-transform active:scale-95"
            />
          </Link>
        </div>

        <form onSubmit={enviar}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
            <Campo id="nome" label="Nome:" placeholder="Digite o seu nome" value={form.nome} onChange={mudar("nome")} required />
            <Campo id="sobrenome" label="Sobrenome:" placeholder="Digite o seu sobrenome" value={form.sobrenome} onChange={mudar("sobrenome")} required />
            <Campo id="nascimento" label="Nascimento:" type="date" value={form.nascimento} onChange={mudar("nascimento")} required />
            <Campo id="email" label="E-mail:" type="email" placeholder="seu@email.com" value={form.email} onChange={mudar("email")} required />
            <Campo id="senha" label="Senha:" type="password" placeholder="Mínimo de 6 caracteres" minLength={6} value={form.senha} onChange={mudar("senha")} required />
            <Campo id="confirmarSenha" label="Confirmar senha:" type="password" placeholder="Confirme sua senha" value={form.confirmarSenha} onChange={mudar("confirmarSenha")} required />
            <Campo id="cpf" label="CPF:" placeholder="000.000.000-00" inputMode="numeric" value={form.cpf} onChange={mudar("cpf", mascaraCPF)} required />
            <Campo id="crn" label="CRN:" placeholder="0000-000/SP" value={form.crn} onChange={mudar("crn")} required />
            <Campo id="telefone" label="Telefone:" placeholder="(00) 00000-0000" inputMode="tel" value={form.telefone} onChange={mudar("telefone", mascaraTelefone)} required />

            <div className="flex flex-col">
              <label htmlFor="genero" className={estiloLabel}>
                Gênero:
              </label>
              <select
                id="genero"
                value={form.genero}
                onChange={mudar("genero")}
                required
                className={`${estiloInput} text-base ${form.genero ? "text-black" : "text-black/50"} cursor-pointer`}
              >
                <option value="" disabled>
                  Selecione o gênero
                </option>
                <option value="Feminino">Feminino</option>
                <option value="Masculino">Masculino</option>
                <option value="Outro">Outro</option>
                <option value="Prefiro não responder">Prefiro não responder</option>
              </select>
            </div>

            <div className="flex flex-col md:col-span-2">
              <label htmlFor="especializacao" className={estiloLabel}>
                Sua especialização:
              </label>
              <select
                id="especializacao"
                value={form.especialidade}
                onChange={mudar("especialidade")}
                required
                className={`${estiloInput} text-base ${form.especialidade ? "text-black" : "text-black/50"} cursor-pointer`}
              >
                <option value="" disabled>
                  Selecione a Especialização
                </option>
                <option value="Clínica e Hospitalar">Nutrição Clínica e Hospitalar</option>
                <option value="Esportiva">Nutrição Esportiva</option>
                <option value="Materno-Infantil">Nutrição Materno-Infantil</option>
                <option value="Comportamental e Emagrecimento">Nutrição Comportamental e Emagrecimento</option>
                <option value="Estética">Nutrição Estética</option>
                <option value="Funcional e Fitoterapia">Nutrição Funcional e Fitoterapia</option>
              </select>
            </div>

            <Campo
              id="foto"
              label="Link da foto (opcional):"
              placeholder="https://..."
              className="md:col-span-2"
              value={form.foto}
              onChange={mudar("foto")}
            />

            {/* Agenda de atendimento: define o que o paciente vê ao agendar */}
            <div className="md:col-span-2">
              <p className={estiloLabel}>Dias de atendimento:</p>
              <div className="flex flex-wrap gap-2">
                {DIAS.map((nome, i) => (
                  <button
                    type="button"
                    key={nome}
                    onClick={() => alternarDia(i)}
                    className={`cursor-pointer rounded-full px-4 py-1 text-sm font-semibold shadow-md transition-transform active:scale-95 ${
                      form.diasAtendimento.includes(i)
                        ? "bg-green-700 text-white"
                        : "bg-white text-green-900 hover:bg-green-100"
                    }`}
                  >
                    {nome}
                  </button>
                ))}
              </div>
            </div>

            <Campo id="horaInicio" label="Início do atendimento:" type="time" value={form.horaInicio} onChange={mudar("horaInicio")} required />
            <Campo id="horaFim" label="Fim do atendimento:" type="time" value={form.horaFim} onChange={mudar("horaFim")} required />

            <div className="flex flex-col md:col-span-2">
              <label htmlFor="duracao" className={estiloLabel}>
                Duração de cada consulta:
              </label>
              <select id="duracao" value={form.duracao} onChange={mudar("duracao")} className={`${estiloInput} cursor-pointer`}>
                <option value="30">30 minutos</option>
                <option value="45">45 minutos</option>
                <option value="60">1 hora</option>
              </select>
            </div>

            {msg.texto && (
              <p
                className={`md:col-span-2 rounded-lg p-3 text-sm font-semibold ${
                  msg.tipo === "ok" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"
                }`}
              >
                {msg.texto}
              </p>
            )}
          </div>

          <div className="flex flex-col items-center mt-8">
            <button
              type="submit"
              disabled={enviando}
              className="cursor-pointer bg-green-700 w-full max-w-md h-12 shadow-md rounded-lg text-white font-bold transition-transform active:scale-95 disabled:opacity-60"
            >
              {enviando ? "Criando conta..." : "Criar conta"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default CadNu;
