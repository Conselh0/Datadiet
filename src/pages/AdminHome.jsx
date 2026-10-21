import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import useNutricionista from "../hooks/useNutricionista";
import { formatarData } from "../utils/formatters";
import { atualizarNutricionista } from "../services/nutricionistaService";
import { getSessao, iniciarSessao } from "../utils/sessao";

const DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const ESPECIALIDADES = [
  "Clínica e Hospitalar",
  "Esportiva",
  "Materno-Infantil",
  "Comportamental e Emagrecimento",
  "Estética",
  "Funcional e Fitoterapia",
];
const INPUT =
  "h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-gray-800 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-200";
const LABEL = "mb-1.5 block text-sm font-semibold text-gray-700";

function criarFormulario(nutricionista) {
  return {
    nome: nutricionista.nome || "",
    email: nutricionista.email || "",
    crn: nutricionista.crn || "",
    especialidade: nutricionista.especialidade || "",
    foto: nutricionista.foto || "",
    genero: nutricionista.genero || "",
    nascimento: nutricionista.nascimento || "",
    telefone: nutricionista.telefone || "",
    diasAtendimento: nutricionista.diasAtendimento || [1, 2, 3, 4, 5],
    horaInicio: nutricionista.horaInicio || "08:00",
    horaFim: nutricionista.horaFim || "17:00",
    duracao: String(nutricionista.duracao || 30),
    senhaAtual: "",
    novaSenha: "",
    confirmarNovaSenha: "",
  };
}

function Campo({ id, label, className = "", ...props }) {
  return (
    <div className={className}>
      <label htmlFor={id} className={LABEL}>
        {label}
      </label>
      <input id={id} className={INPUT} {...props} />
    </div>
  );
}

function AdminHome() {
  const modal = useRef(null);
  const { nutricionista, carregando, erro } = useNutricionista();
  const [perfilAtualizado, setPerfilAtualizado] = useState(null);
  const [form, setForm] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [processandoFoto, setProcessandoFoto] = useState(false);
  const [nomeArquivoFoto, setNomeArquivoFoto] = useState("");
  const [erroFormulario, setErroFormulario] = useState("");
  const [mensagem, setMensagem] = useState("");
  const perfil = perfilAtualizado || nutricionista;

  function abrirModal() {
    if (!perfil) return;
    setForm(criarFormulario(perfil));
    setNomeArquivoFoto("");
    setErroFormulario("");
    setMensagem("");
    modal.current.showModal();
  }

  function fecharModal() {
    modal.current.close();
    setErroFormulario("");
  }

  function mudar(campo) {
    return (event) =>
      setForm((atual) => ({ ...atual, [campo]: event.target.value }));
  }

  function selecionarFoto(event) {
    const arquivo = event.target.files?.[0];
    event.target.value = "";
    if (!arquivo) return;

    const tiposPermitidos = ["image/png", "image/jpeg", "image/webp", "image/gif"];
    if (!tiposPermitidos.includes(arquivo.type)) {
      setErroFormulario("Escolha uma imagem PNG, JPEG, WebP ou GIF.");
      return;
    }
    if (arquivo.size > 2 * 1024 * 1024) {
      setErroFormulario("A imagem deve ter no máximo 2 MB.");
      return;
    }

    setErroFormulario("");
    setProcessandoFoto(true);
    const leitor = new FileReader();
    leitor.onload = () => {
      if (typeof leitor.result !== "string") {
        setErroFormulario("Não foi possível ler a imagem selecionada.");
      } else {
        setForm((atual) => ({ ...atual, foto: leitor.result }));
        setNomeArquivoFoto(arquivo.name);
      }
      setProcessandoFoto(false);
    };
    leitor.onerror = () => {
      setErroFormulario("Não foi possível processar a imagem selecionada.");
      setProcessandoFoto(false);
    };
    leitor.readAsDataURL(arquivo);
  }

  function alternarDia(dia) {
    setForm((atual) => ({
      ...atual,
      diasAtendimento: atual.diasAtendimento.includes(dia)
        ? atual.diasAtendimento.filter((selecionado) => selecionado !== dia)
        : [...atual.diasAtendimento, dia].sort((a, b) => a - b),
    }));
  }

  async function salvar(event) {
    event.preventDefault();
    setErroFormulario("");

    if (processandoFoto) {
      setErroFormulario("Aguarde o processamento da imagem.");
      return;
    }
    if (form.diasAtendimento.length === 0) {
      setErroFormulario("Escolha ao menos um dia de atendimento.");
      return;
    }
    if (
      (form.senhaAtual || form.novaSenha || form.confirmarNovaSenha) &&
      (!form.senhaAtual || !form.novaSenha || !form.confirmarNovaSenha)
    ) {
      setErroFormulario(
        "Para alterar a senha, preencha a senha atual e os dois campos da nova senha.",
      );
      return;
    }
    if (
      form.novaSenha &&
      form.novaSenha !== form.confirmarNovaSenha
    ) {
      setErroFormulario("A confirmação da nova senha não confere.");
      return;
    }

    try {
      setEnviando(true);
      const resposta = await atualizarNutricionista(perfil._id, {
        ...form,
        duracao: Number(form.duracao),
      });
      setPerfilAtualizado(resposta.nutricionista);
      window.dispatchEvent(
        new CustomEvent("nutricionista-atualizado", {
          detail: resposta.nutricionista,
        }),
      );
      iniciarSessao("nutricionista", {
        ...(getSessao() || {}),
        id: resposta.nutricionista._id,
        nome: resposta.nutricionista.nome,
        email: resposta.nutricionista.email,
      });
      setMensagem(resposta.mensagem);
      modal.current.close();
    } catch (error) {
      setErroFormulario(error.message);
    } finally {
      setEnviando(false);
    }
  }

  const dados = [
    ["CRN", perfil?.crn],
    ["Especialidade", perfil?.especialidade],
    ["E-mail", perfil?.email, true],
    ["Telefone", perfil?.telefone],
    ["Gênero", perfil?.genero],
    [
      "Data de nascimento",
      perfil?.nascimento ? formatarData(perfil.nascimento) : "",
    ],
  ];
  const diasSelecionados = (perfil?.diasAtendimento || [])
    .slice()
    .sort((a, b) => a - b)
    .map((dia) => DIAS[dia])
    .join(", ");

  return (
    <main className="min-h-screen w-full bg-gray-100 p-4 sm:p-6 lg:p-10">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-gray-500">
            Área administrativa
          </p>
          <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl">
            Meu perfil
          </h1>
          <p className="mt-2 text-gray-500">
            Consulte e atualize seus dados profissionais e horários de atendimento.
          </p>
        </header>

        {!carregando && !perfil && (
          <div className="rounded-2xl bg-yellow-100 p-4 text-yellow-900">
            {erro || "Nenhum nutricionista identificado neste navegador."}{" "}
            <Link to="/CadNu" className="font-bold underline">
              Criar conta de nutricionista
            </Link>
          </div>
        )}

        {mensagem && (
          <p role="status" className="mb-5 rounded-xl bg-green-100 p-4 text-green-800">
            {mensagem}
          </p>
        )}

        {perfil && (
          <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl shadow-gray-900/5">
            <div className="relative overflow-hidden bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600 px-5 py-7 text-white sm:px-8 sm:py-9">
              <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full border-[32px] border-white/[0.06]" />
              <div className="pointer-events-none absolute -bottom-24 right-40 h-48 w-48 rounded-full bg-white/[0.04]" />
              <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
                {perfil.foto ? (
                  <img
                    src={perfil.foto}
                    alt={`Foto de ${perfil.nome}`}
                    className="h-20 w-20 shrink-0 rounded-2xl border border-white/20 object-cover shadow-inner"
                  />
                ) : (
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-2xl font-bold text-white shadow-inner">
                    {perfil.nome
                      .split(" ")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((parte) => parte[0].toUpperCase())
                      .join("")}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-gray-300">
                    Perfil profissional
                  </p>
                  <h2 className="truncate text-2xl font-bold sm:text-3xl">
                    {perfil.nome}
                  </h2>
                  <p className="mt-2 text-sm text-gray-300">
                    {perfil.especialidade || "Nutricionista"}{" "}
                    <span className="mx-1 text-gray-500">·</span>
                    ID {perfil._id.slice(-6).toUpperCase()}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={abrirModal}
                  className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 font-semibold text-white transition hover:bg-white/20"
                >
                  <Settings size={18} aria-hidden="true" />
                  Editar perfil
                </button>
              </div>
            </div>

            <div className="space-y-8 p-5 sm:p-8">
              <section>
                <div className="mb-4 flex items-center gap-3">
                  <span className="h-6 w-1 rounded-full bg-gray-500" />
                  <h3 className="text-lg font-bold text-gray-800">
                    Dados profissionais e pessoais
                  </h3>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {dados.map(([rotulo, valor, quebrar]) => (
                    <div
                      key={rotulo}
                      className="rounded-2xl border border-gray-200 bg-gray-50 p-4 transition hover:border-gray-300 hover:bg-gray-100"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        {rotulo}
                      </p>
                      <p
                        className={`mt-2 font-semibold text-gray-800 ${quebrar ? "break-all" : ""}`}
                      >
                        {valor || "Não informado"}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-gray-200 bg-gray-50 p-5 sm:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <span className="h-6 w-1 rounded-full bg-gray-500" />
                  <h3 className="text-lg font-bold text-gray-800">
                    Horários de atendimento
                  </h3>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <p className="mb-3 text-sm font-medium text-gray-500">
                      Dias disponíveis
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(perfil.diasAtendimento || [])
                        .slice()
                        .sort((a, b) => a - b)
                        .map((dia) => (
                          <span
                            key={dia}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 shadow-sm"
                          >
                            {DIAS[dia]}
                          </span>
                        ))}
                      {!diasSelecionados && (
                        <span className="text-sm text-gray-500">
                          Não informado
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <p className="text-sm font-medium text-gray-500">
                      Horário e duração
                    </p>
                    <p className="mt-2 text-lg font-bold text-gray-800">
                      {perfil.horaInicio || "08:00"}–{perfil.horaFim || "17:00"}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {perfil.duracao || 30} minutos por consulta
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </section>
        )}
      </div>

      <dialog
        ref={modal}
        aria-labelledby="titulo-editar-perfil"
        className="m-auto max-h-[90vh] w-[min(42rem,calc(100%-2rem))] rounded-3xl bg-gray-100 p-0 shadow-2xl backdrop:bg-gray-900/60"
      >
        {form && (
          <form onSubmit={salvar} className="max-h-[90vh] overflow-y-auto p-5 sm:p-7">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2
                  id="titulo-editar-perfil"
                  className="text-2xl font-bold text-gray-800"
                >
                  Editar perfil
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Atualize seus dados, horários de atendimento ou senha.
                </p>
              </div>
              <button
                type="button"
                onClick={fecharModal}
                aria-label="Fechar edição"
                className="rounded-lg px-3 py-1 text-xl text-gray-500 transition hover:bg-gray-200 hover:text-gray-800"
              >
                ×
              </button>
            </div>

            <section className="mb-5 rounded-2xl bg-white p-5 shadow-sm">
              <h3 className="mb-4 font-bold text-gray-800">
                Dados da nutricionista
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Campo
                  id="nome"
                  label="Nome completo"
                  value={form.nome}
                  onChange={mudar("nome")}
                  autoComplete="name"
                  required
                />
                <Campo
                  id="email"
                  label="E-mail"
                  type="email"
                  value={form.email}
                  onChange={mudar("email")}
                  autoComplete="email"
                  required
                />
                <Campo
                  id="crn"
                  label="CRN"
                  value={form.crn}
                  onChange={mudar("crn")}
                  required
                />
                <div>
                  <label htmlFor="especialidade" className={LABEL}>
                    Especialidade
                  </label>
                  <select
                    id="especialidade"
                    className={INPUT}
                    value={form.especialidade}
                    onChange={mudar("especialidade")}
                    required
                  >
                    <option value="" disabled>
                      Selecione a especialidade
                    </option>
                    {ESPECIALIDADES.map((especialidade) => (
                      <option key={especialidade} value={especialidade}>
                        {especialidade}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="genero" className={LABEL}>
                    Gênero
                  </label>
                  <select
                    id="genero"
                    className={INPUT}
                    value={form.genero}
                    onChange={mudar("genero")}
                    required
                  >
                    <option value="" disabled>
                      Selecione o gênero
                    </option>
                    {["Feminino", "Masculino", "Outro", "Prefiro não responder"].map(
                      (genero) => (
                        <option key={genero} value={genero}>
                          {genero}
                        </option>
                      ),
                    )}
                  </select>
                </div>
                <Campo
                  id="nascimento"
                  label="Data de nascimento"
                  type="date"
                  value={form.nascimento}
                  onChange={mudar("nascimento")}
                  required
                />
                <Campo
                  id="telefone"
                  label="Telefone"
                  type="tel"
                  value={form.telefone}
                  onChange={mudar("telefone")}
                  autoComplete="tel"
                />
                <div className="sm:col-span-2">
                  <label htmlFor="foto" className={LABEL}>
                    Foto de perfil
                  </label>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    {form.foto && (
                      <img
                        src={form.foto}
                        alt="Prévia da foto de perfil"
                        className="h-16 w-16 rounded-full border border-gray-200 object-cover"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <input
                        id="foto"
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        onChange={selecionarFoto}
                        className="block w-full cursor-pointer rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 file:mr-4 file:cursor-pointer file:border-0 file:bg-gray-800 file:px-4 file:py-3 file:font-semibold file:text-white hover:file:bg-gray-700"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        PNG, JPEG, WebP ou GIF. Tamanho máximo: 2 MB.
                        {nomeArquivoFoto && ` Arquivo: ${nomeArquivoFoto}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-5 rounded-2xl bg-white p-5 shadow-sm">
              <h3 className="mb-4 font-bold text-gray-800">
                Agenda de atendimento
              </h3>
              <fieldset>
                <legend className={LABEL}>Dias de atendimento</legend>
                <div className="flex flex-wrap gap-2">
                  {DIAS.map((dia, indice) => {
                    const selecionado = form.diasAtendimento.includes(indice);
                    return (
                      <button
                        key={dia}
                        type="button"
                        aria-pressed={selecionado}
                        onClick={() => alternarDia(indice)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                          selecionado
                            ? "bg-gray-800 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {dia}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <Campo
                  id="horaInicio"
                  label="Início"
                  type="time"
                  value={form.horaInicio}
                  onChange={mudar("horaInicio")}
                  required
                />
                <Campo
                  id="horaFim"
                  label="Fim"
                  type="time"
                  value={form.horaFim}
                  onChange={mudar("horaFim")}
                  required
                />
                <div>
                  <label htmlFor="duracao" className={LABEL}>
                    Duração da consulta
                  </label>
                  <select
                    id="duracao"
                    className={INPUT}
                    value={form.duracao}
                    onChange={mudar("duracao")}
                    required
                  >
                    <option value="30">30 minutos</option>
                    <option value="45">45 minutos</option>
                    <option value="60">60 minutos</option>
                  </select>
                </div>
              </div>
            </section>

            <details className="mb-5 rounded-2xl bg-white p-5 shadow-sm">
              <summary className="cursor-pointer font-bold text-gray-800">
                Alterar senha
              </summary>
              <p className="mb-4 mt-2 text-sm text-gray-500">
                Informe sua senha atual para definir uma nova.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Campo
                  id="senhaAtual"
                  label="Senha atual"
                  type="password"
                  value={form.senhaAtual}
                  onChange={mudar("senhaAtual")}
                  autoComplete="current-password"
                />
                <span className="hidden sm:block" />
                <Campo
                  id="novaSenha"
                  label="Nova senha"
                  type="password"
                  minLength={6}
                  value={form.novaSenha}
                  onChange={mudar("novaSenha")}
                  autoComplete="new-password"
                />
                <Campo
                  id="confirmarNovaSenha"
                  label="Confirmar nova senha"
                  type="password"
                  minLength={6}
                  value={form.confirmarNovaSenha}
                  onChange={mudar("confirmarNovaSenha")}
                  autoComplete="new-password"
                />
              </div>
            </details>

            {erroFormulario && (
              <p
                role="alert"
                className="mb-4 rounded-xl bg-red-100 p-3 text-sm font-semibold text-red-700"
              >
                {erroFormulario}
              </p>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={fecharModal}
                className="h-11 rounded-xl border border-gray-300 px-5 font-semibold text-gray-700 transition hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={enviando || processandoFoto}
                className="h-11 rounded-xl bg-gray-800 px-6 font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {processandoFoto
                  ? "Processando imagem..."
                  : enviando
                    ? "Salvando..."
                    : "Salvar alterações"}
              </button>
            </div>
          </form>
        )}
      </dialog>
    </main>
  );
}

export default AdminHome;
