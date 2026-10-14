import { useState } from "react";
import NutricionistaCard from "../components/NutricionistaCard";
import { cadastrarNutricionista } from "../services/nutricionistaService";

const DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const VAZIO = {
  nome: "",
  especialidade: "",
  crn: "",
  email: "",
  foto: "",
  diasAtendimento: [1, 2, 3, 4, 5],
  horaInicio: "08:00",
  horaFim: "17:00",
  duracao: 30,
};

const campo =
  "w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500";

function CadNutricionista() {
  const [form, setForm] = useState(VAZIO);
  const [enviando, setEnviando] = useState(false);
  const [msg, setMsg] = useState({ tipo: "", texto: "" });

  const mudar = (campoNome) => (e) =>
    setForm({ ...form, [campoNome]: e.target.value });

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
    try {
      setEnviando(true);
      const r = await cadastrarNutricionista({
        ...form,
        duracao: Number(form.duracao),
      });
      setMsg({ tipo: "ok", texto: r.mensagem });
      setForm(VAZIO);
    } catch (err) {
      setMsg({ tipo: "erro", texto: err.message });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-green-400/20 p-4 md:p-10">
      <h1 className="mb-8 text-center text-3xl font-bold text-green-700 md:text-4xl">
        CADASTRAR NUTRICIONISTA
      </h1>

      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-center">
        <form
          onSubmit={enviar}
          className="flex w-full max-w-lg flex-col gap-4 rounded-2xl bg-white p-6 text-left shadow-lg"
        >
          <label className="text-sm font-medium text-gray-700">
            Nome
            <input
              className={campo}
              value={form.nome}
              onChange={mudar("nome")}
              required
            />
          </label>

          <label className="text-sm font-medium text-gray-700">
            Especialidade
            <input
              className={campo}
              placeholder="Ex.: Clínica e Hospitalar"
              value={form.especialidade}
              onChange={mudar("especialidade")}
              required
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-gray-700">
              CRN
              <input
                className={campo}
                value={form.crn}
                onChange={mudar("crn")}
              />
            </label>
            <label className="text-sm font-medium text-gray-700">
              E-mail
              <input
                type="email"
                className={campo}
                value={form.email}
                onChange={mudar("email")}
              />
            </label>
          </div>

          <label className="text-sm font-medium text-gray-700">
            Link da foto (opcional)
            <input
              className={campo}
              placeholder="https://..."
              value={form.foto}
              onChange={mudar("foto")}
            />
          </label>

          <div>
            <p className="mb-1 text-sm font-medium text-gray-700">
              Dias de atendimento
            </p>
            <div className="flex flex-wrap gap-2">
              {DIAS.map((nome, i) => (
                <button
                  type="button"
                  key={nome}
                  onClick={() => alternarDia(i)}
                  className={`rounded-full px-3 py-1 text-sm font-semibold transition ${
                    form.diasAtendimento.includes(i)
                      ? "bg-green-700 text-white"
                      : "bg-green-50 text-green-900 hover:bg-green-200"
                  }`}
                >
                  {nome}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="text-sm font-medium text-gray-700">
              Início
              <input
                type="time"
                className={campo}
                value={form.horaInicio}
                onChange={mudar("horaInicio")}
                required
              />
            </label>
            <label className="text-sm font-medium text-gray-700">
              Fim
              <input
                type="time"
                className={campo}
                value={form.horaFim}
                onChange={mudar("horaFim")}
                required
              />
            </label>
            <label className="text-sm font-medium text-gray-700">
              Duração
              <select
                className={campo}
                value={form.duracao}
                onChange={mudar("duracao")}
              >
                <option value={30}>30 min</option>
                <option value={45}>45 min</option>
                <option value={60}>1 hora</option>
              </select>
            </label>
          </div>

          {msg.texto && (
            <p
              className={`rounded-md p-3 text-sm font-semibold ${
                msg.tipo === "ok"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {msg.texto}
            </p>
          )}

          <button
            disabled={enviando}
            className="rounded-lg bg-green-600 py-2 font-bold text-white hover:bg-green-700 disabled:opacity-60"
          >
            {enviando ? "Cadastrando..." : "Cadastrar nutricionista"}
          </button>
        </form>

        {/* Prévia do card que o paciente vai ver */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-semibold text-green-800">
            Assim o paciente vai ver:
          </p>
          <NutricionistaCard
            nutricionista={{
              ...form,
              nome: form.nome || "Nome do nutricionista",
              especialidade: form.especialidade || "Especialidade",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default CadNutricionista;
