import { useEffect, useRef, useState } from "react";
import { Mail, Phone, Settings } from "lucide-react";
import ProximaConsulta from "../components/ProximaConsulta";
import { getSessao } from "../utils/sessao";

const API = import.meta.env.VITE_API_URL

const INPUT =
  "h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-gray-800 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100";
const LABEL = "mb-1.5 block text-sm font-semibold text-gray-700";

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

function dataParaInput(data) {
  if (!data) return "";
  return typeof data === "string" ? data.slice(0, 10) : "";
}

function formatarData(data) {
  if (!data) return "Não informado";
  const [ano, mes, dia] = dataParaInput(data).split("-");
  return ano && mes && dia ? `${dia}/${mes}/${ano}` : "Não informado";
}

function normalizarGenero(genero = "") {
  return {
    m: "masculino",
    masculino: "masculino",
    f: "feminino",
    feminino: "feminino",
    outro: "outro",
  }[genero.toLowerCase()] || "";
}

function UserHome() {
  const modal = useRef(null);
  const [perfil, setPerfil] = useState(null);
  const [form, setForm] = useState(null);
  const [carregando, setCarregando] = useState(() => {
    const sessao = getSessao();
    return Boolean(
      sessao?.tipo === "paciente" && (sessao.id || sessao._id),
    );
  });
  const [erro, setErro] = useState(() => {
    const sessao = getSessao();
    return sessao?.tipo === "paciente" && (sessao.id || sessao._id)
      ? ""
      : "Não foi possível identificar o paciente logado.";
  });
  const [erroFormulario, setErroFormulario] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [urlFoto, setUrlFoto] = useState("");
  const [erroFoto, setErroFoto] = useState("");
  const [mensagemFoto, setMensagemFoto] = useState("");
  const [salvandoFoto, setSalvandoFoto] = useState(false);

  useEffect(() => {
    let ativo = true;
    const sessao = getSessao();
    const idUsuario = sessao?.id || sessao?._id;

    if (!idUsuario || sessao?.tipo !== "paciente") return;

    fetch(`${API}/perfil/${idUsuario}`)
      .then(async (resposta) => {
        const dados = await resposta.json().catch(() => ({}));
        if (!resposta.ok) {
          throw new Error(dados.erro || "Não foi possível carregar o perfil.");
        }
        return dados;
      })
      .then((dados) => {
        if (ativo) setPerfil(dados);
      })
      .catch((error) => {
        if (ativo) setErro(error.message);
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  function abrirModal() {
    if (!perfil) return;
    setForm({
      nome: perfil.nome || "",
      sobrenome: perfil.sobrenome || "",
      email: perfil.email || "",
      nascimento: dataParaInput(perfil.nascimento),
      genero: normalizarGenero(perfil.genero),
      telefone: perfil.telefone || "",
      senhaAtual: "",
      novaSenha: "",
      confirmarNovaSenha: "",
    });
    setUrlFoto("");
    setErroFormulario("");
    setErroFoto("");
    setMensagemFoto("");
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

  async function salvar(event) {
    event.preventDefault();
    setErroFormulario("");

    if (
      (form.senhaAtual || form.novaSenha || form.confirmarNovaSenha) &&
      (!form.senhaAtual || !form.novaSenha || !form.confirmarNovaSenha)
    ) {
      setErroFormulario(
        "Para alterar a senha, preencha a senha atual e os dois campos da nova senha.",
      );
      return;
    }
    if (form.novaSenha && form.novaSenha !== form.confirmarNovaSenha) {
      setErroFormulario("A confirmação da nova senha não confere.");
      return;
    }

    const sessao = getSessao();
    const idUsuario = sessao?.id || sessao?._id;
    if (!idUsuario) {
      setErroFormulario("Não foi possível identificar o paciente logado.");
      return;
    }

    try {
      setEnviando(true);
      const resposta = await fetch(`${API}/perfil/${idUsuario}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const dados = await resposta.json().catch(() => ({}));
      if (!resposta.ok) {
        throw new Error(dados.erro || "Não foi possível atualizar o perfil.");
      }

      setPerfil(dados.usuario);
      const sessaoAtualizada = {
        ...sessao,
        nome: dados.usuario.nome,
        email: dados.usuario.email,
      };
      localStorage.setItem("usuario", JSON.stringify(sessaoAtualizada));
      window.dispatchEvent(
        new CustomEvent("perfil-atualizado", {
          detail: {
            nome: dados.usuario.nome,
            sobrenome: dados.usuario.sobrenome,
            email: dados.usuario.email,
            fotoPerfil: dados.usuario.fotoPerfil || "",
          },
        }),
      );
      setMensagem(dados.mensagem);
      modal.current.close();
    } catch (error) {
      setErroFormulario(error.message);
    } finally {
      setEnviando(false);
    }
  }

  async function atualizarFoto(tipo, valor) {
    const sessao = getSessao();
    const idUsuario = sessao?.id || sessao?._id;
    if (!idUsuario) {
      setErroFoto("Não foi possível identificar o paciente logado.");
      return;
    }

    try {
      setErroFoto("");
      setMensagemFoto("");
      setSalvandoFoto(true);
      const resposta = await fetch(`${API}/perfil/${idUsuario}/foto`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo, valor }),
      });
      const dados = await resposta.json().catch(() => ({}));
      if (!resposta.ok) {
        throw new Error(dados.erro || "Não foi possível atualizar a foto.");
      }

      setPerfil((atual) => ({ ...atual, fotoPerfil: dados.fotoPerfil || "" }));
      localStorage.setItem(
        "usuario",
        JSON.stringify({ ...sessao, fotoPerfil: dados.fotoPerfil || "" }),
      );
      window.dispatchEvent(
        new CustomEvent("perfil-atualizado", {
          detail: { fotoPerfil: dados.fotoPerfil || "" },
        }),
      );
      setUrlFoto("");
      setMensagemFoto("Foto de perfil atualizada.");
    } catch (error) {
      setErroFoto(error.message);
    } finally {
      setSalvandoFoto(false);
    }
  }

  function enviarUploadFoto(event) {
    const arquivo = event.target.files?.[0];
    event.target.value = "";
    if (!arquivo) return;

    const tiposPermitidos = ["image/png", "image/jpeg", "image/webp", "image/gif"];
    if (!tiposPermitidos.includes(arquivo.type)) {
      setErroFoto("Escolha uma imagem PNG, JPEG, WebP ou GIF.");
      return;
    }
    if (arquivo.size > 2 * 1024 * 1024) {
      setErroFoto("A imagem deve ter no máximo 2 MB.");
      return;
    }

    setErroFoto("");
    const leitor = new FileReader();
    leitor.onload = () => {
      if (typeof leitor.result !== "string") {
        setErroFoto("Não foi possível ler a imagem selecionada.");
        return;
      }
      atualizarFoto("upload", leitor.result);
    };
    leitor.onerror = () => {
      setErroFoto("Não foi possível processar a imagem selecionada.");
    };
    leitor.readAsDataURL(arquivo);
  }

  const nomeCompleto = perfil
    ? [perfil.nome, perfil.sobrenome].filter(Boolean).join(" ")
    : "";
  const iniciais = nomeCompleto
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0].toUpperCase())
    .join("");
  const generoExibido = {
    masculino: "Masculino",
    feminino: "Feminino",
    outro: "Prefiro não responder",
  }[normalizarGenero(perfil?.genero)] || "Não informado";

  return (
    <main className="min-h-screen w-full bg-gray-100 p-4 sm:p-6 lg:p-10">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-green-800">
            Área do paciente
          </p>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Meu perfil
          </h1>
          <p className="mt-2 text-gray-600">
            Consulte seus dados pessoais e acompanhe sua próxima consulta.
          </p>
        </header>

        {mensagem && (
          <p
            role="status"
            className="mb-5 rounded-xl border border-green-200 bg-green-100 p-4 font-medium text-green-900"
          >
            {mensagem}
          </p>
        )}

        {erro && (
          <p role="alert" className="mb-5 rounded-xl bg-red-100 p-4 text-red-700">
            {erro}
          </p>
        )}

        {carregando && (
          <p className="mb-5 rounded-2xl bg-white p-5 text-green-900 shadow-sm">
            Carregando seus dados...
          </p>
        )}

        {perfil && (
          <section className="mb-8 overflow-hidden rounded-3xl border border-gray-200 bg-gray-200 shadow-xl shadow-gray-900/5">
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-green-900 to-emerald-800 px-5 py-7 text-white sm:px-8 sm:py-9">
              <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full border-[32px] border-white/[0.06]" />
              <div className="pointer-events-none absolute -bottom-24 right-40 h-48 w-48 rounded-full bg-white/[0.04]" />
              <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
                {perfil.fotoPerfil ? (
                  <img
                    src={perfil.fotoPerfil}
                    alt={`Foto de ${nomeCompleto}`}
                    className="h-20 w-20 shrink-0 rounded-2xl border border-white/20 object-cover shadow-lg"
                  />
                ) : (
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-2xl font-bold shadow-inner">
                    {iniciais}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-green-100">
                    Perfil do paciente
                  </p>
                  <h2 className="truncate text-2xl font-bold sm:text-3xl">
                    {nomeCompleto}
                  </h2>
                  <p className="mt-2 text-sm text-green-100/80">
                    Paciente
                    <span className="mx-2 text-green-300/60">·</span>
                    ID {String(perfil._id).slice(-6).toUpperCase()}
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

            <div className="space-y-8 bg-gray-200 p-5 sm:p-8">
              <section>
                <div className="mb-4 flex items-center gap-3">
                  <span className="h-6 w-1 rounded-full bg-green-700" />
                  <h3 className="text-lg font-bold text-gray-900">
                    Dados pessoais
                  </h3>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-2xl border border-gray-300 bg-gray-100 p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Nome completo
                    </p>
                    <p className="mt-2 font-semibold text-gray-900">
                      {nomeCompleto}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-gray-300 bg-gray-100 p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Data de nascimento
                    </p>
                    <p className="mt-2 font-semibold text-gray-900">
                      {formatarData(perfil.nascimento)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-gray-300 bg-gray-100 p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Gênero
                    </p>
                    <p className="mt-2 font-semibold text-gray-900">
                      {generoExibido}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-gray-300 bg-gray-100 p-4 shadow-sm">
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-600">
                      <Mail size={14} aria-hidden="true" /> E-mail
                    </p>
                    <p className="mt-2 break-all font-semibold text-gray-900">
                      {perfil.email}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-gray-300 bg-gray-100 p-4 shadow-sm">
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-600">
                      <Phone size={14} aria-hidden="true" /> Telefone
                    </p>
                    <p className="mt-2 font-semibold text-gray-900">
                      {perfil.telefone || "Não informado"}
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </section>
        )}

        <ProximaConsulta refresh={perfil?._id} />
      </div>

      <dialog
        ref={modal}
        aria-labelledby="titulo-editar-perfil-paciente"
        className="m-auto max-h-[90vh] w-[min(42rem,calc(100%-2rem))] rounded-3xl bg-green-50 p-0 shadow-2xl backdrop:bg-green-950/60"
      >
        {form && (
          <form
            onSubmit={salvar}
            className="max-h-[90vh] overflow-y-auto p-5 sm:p-7"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2
                  id="titulo-editar-perfil-paciente"
                  className="text-2xl font-bold text-green-950"
                >
                  Editar perfil
                </h2>
                <p className="mt-1 text-sm text-green-900/70">
                  Atualize seus dados pessoais, foto ou senha.
                </p>
              </div>
              <button
                type="button"
                onClick={fecharModal}
                aria-label="Fechar edição"
                className="rounded-lg px-3 py-1 text-xl text-green-800 transition hover:bg-green-100"
              >
                ×
              </button>
            </div>

            <section className="mb-5 rounded-2xl bg-white p-5 shadow-sm">
              <h3 className="mb-4 font-bold text-green-950">Dados pessoais</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Campo
                  id="nome"
                  label="Nome"
                  value={form.nome}
                  onChange={mudar("nome")}
                  autoComplete="given-name"
                  required
                />
                <Campo
                  id="sobrenome"
                  label="Sobrenome"
                  value={form.sobrenome}
                  onChange={mudar("sobrenome")}
                  autoComplete="family-name"
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
                  id="nascimento"
                  label="Data de nascimento"
                  type="date"
                  value={form.nascimento}
                  onChange={mudar("nascimento")}
                  required
                />
                <div>
                  <label htmlFor="genero" className={LABEL}>
                    Gênero
                  </label>
                  <select
                    id="genero"
                    value={form.genero}
                    onChange={mudar("genero")}
                    className={INPUT}
                    required
                  >
                    <option value="" disabled>
                      Selecione o gênero
                    </option>
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                    <option value="outro">Prefiro não responder</option>
                  </select>
                </div>
                <Campo
                  id="telefone"
                  label="Telefone"
                  type="tel"
                  value={form.telefone}
                  onChange={mudar("telefone")}
                  autoComplete="tel"
                />
              </div>
            </section>

            <section className="mb-5 rounded-2xl bg-white p-5 shadow-sm">
              <h3 className="mb-4 font-bold text-green-950">Foto de perfil</h3>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <img
                  src={perfil?.fotoPerfil || "/img/avatar.png"}
                  alt="Prévia da foto de perfil"
                  className="h-20 w-20 rounded-full border border-green-200 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <label htmlFor="uploadFotoPaciente" className={LABEL}>
                    Escolher arquivo
                  </label>
                  <input
                    id="uploadFotoPaciente"
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={enviarUploadFoto}
                    disabled={salvandoFoto}
                    className="block w-full cursor-pointer rounded-xl border border-green-100 bg-green-50 text-sm text-gray-700 file:mr-4 file:cursor-pointer file:border-0 file:bg-green-800 file:px-4 file:py-3 file:font-semibold file:text-white hover:file:bg-green-900"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    PNG, JPEG, WebP ou GIF; máximo de 2 MB.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <input
                  type="url"
                  aria-label="URL da foto de perfil"
                  placeholder="Ou informe o link da imagem"
                  value={urlFoto}
                  onChange={(event) => setUrlFoto(event.target.value)}
                  className={INPUT}
                />
                <button
                  type="button"
                  onClick={() => atualizarFoto("url", urlFoto.trim())}
                  disabled={salvandoFoto || !urlFoto.trim()}
                  className="h-11 shrink-0 rounded-xl bg-green-800 px-4 font-semibold text-white transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {salvandoFoto ? "Salvando..." : "Salvar foto"}
                </button>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => atualizarFoto("remover", "")}
                  disabled={salvandoFoto || !perfil?.fotoPerfil}
                  className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Remover foto
                </button>
                {erroFoto && (
                  <p role="alert" className="text-sm text-red-700">
                    {erroFoto}
                  </p>
                )}
                {mensagemFoto && (
                  <p role="status" className="text-sm text-green-800">
                    {mensagemFoto}
                  </p>
                )}
              </div>
            </section>

            <details className="mb-5 rounded-2xl bg-white p-5 shadow-sm">
              <summary className="cursor-pointer font-bold text-green-950">
                Alterar senha
              </summary>
              <p className="mb-4 mt-2 text-sm text-gray-500">
                A nova senha deve ter pelo menos 8 caracteres.
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
                  minLength={8}
                  value={form.novaSenha}
                  onChange={mudar("novaSenha")}
                  autoComplete="new-password"
                />
                <Campo
                  id="confirmarNovaSenha"
                  label="Confirmar nova senha"
                  type="password"
                  minLength={8}
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
                className="h-11 rounded-xl border border-green-200 px-5 font-semibold text-green-900 transition hover:bg-green-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={enviando}
                className="h-11 rounded-xl bg-green-800 px-6 font-semibold text-white transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {enviando ? "Salvando..." : "Salvar alterações"}
              </button>
            </div>
          </form>
        )}
      </dialog>
    </main>
  );
}

export default UserHome;
