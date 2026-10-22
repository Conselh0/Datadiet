import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock3,
  Pencil,
  Save,
  Trash2,
  Mail,
  Phone,
  X,
} from "lucide-react";
import { getSessao } from "../utils/sessao";
import { listarAnamneses } from "../services/nutricionistaService";
import { request } from "../services/agendamentoService";
import { formatarData } from "../utils/formatters";

const ROTULOS = {
  pesoKg: "Peso",
  alturaCm: "Altura",
  medidaCinturaCm: "Medida da cintura",
  objetivoPrincipal: "Objetivo principal",
  objetivoOutro: "Outro objetivo",
  diagnosticos: "Diagnósticos",
  diagnosticoOutro: "Outro diagnóstico",
  medicamentos: "Medicamentos",
  medicamentosDetalhe: "Detalhes dos medicamentos",
  suplementos: "Suplementos",
  suplementosDetalhe: "Detalhes dos suplementos",
  alergias: "Alergias e intolerâncias",
  alergiaOutra: "Outra alergia ou intolerância",
  restricoesAlimentares: "Restrições alimentares",
  historicoFamiliar: "Histórico familiar",
  historicoFamiliarOutro: "Outro histórico familiar",
  sintomas: "Sintomas",
  refeicoesHabituais: "Refeições habituais",
  alimentosFrequentes: "Alimentos frequentes",
  aguaLitros: "Consumo de água",
  atividadeFisica: "Atividade física",
  frequenciaAtividade: "Frequência de atividade física",
  sono: "Sono",
  bebidaAlcoolica: "Consumo de bebida alcoólica",
  tabagismo: "Tabagismo",
  relacaoComAlimentacao: "Relação com a alimentação",
  adesaoPlano: "Adesão ao plano",
  dificuldades: "Dificuldades",
  alteracoesSaude: "Mudanças na saúde",
  alteracoesSaudeDetalhe: "Detalhes das mudanças na saúde",
  funcionamentoIntestinal: "Funcionamento intestinal",
  mudancasAlimentares: "Mudanças na alimentação",
  observacoes: "Observações",
};

function formatarValor(valor) {
  if (Array.isArray(valor)) return valor.filter(Boolean).join(", ");
  if (valor && typeof valor === "object") return JSON.stringify(valor);
  if (typeof valor === "boolean") return valor ? "Sim" : "Não";
  return String(valor ?? "").trim();
}

function formatarRotulo(chave) {
  return ROTULOS[chave] || chave.replace(/([A-Z])/g, " $1").replace(/^./, (letra) => letra.toUpperCase());
}

function formatarDataPaciente(data) {
  if (!data) return "Não informado";
  const dataIso = typeof data === "string" ? data.slice(0, 10) : "";
  const partes = dataIso.split("-");
  if (partes.length === 3) return `${partes[2]}/${partes[1]}/${partes[0]}`;
  return "Não informado";
}

function ModalPaciente({ paciente, aberto, fechar, onAtualizado, onExcluido }) {
  const modal = useRef(null);
  const [vendoFichas, setVendoFichas] = useState(false);
  const [fichas, setFichas] = useState([]);
  const [indiceFicha, setIndiceFicha] = useState(0);
  const [carregandoFichas, setCarregandoFichas] = useState(false);
  const [erroFichas, setErroFichas] = useState("");
  const [carregadas, setCarregadas] = useState(false);
  const [fichasPacienteId, setFichasPacienteId] = useState(null);
  const [editando, setEditando] = useState(false);
  const [formulario, setFormulario] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);
  const [erroAcao, setErroAcao] = useState("");
  const [avisoAcao, setAvisoAcao] = useState("");

  useEffect(() => {
    if (aberto && !modal.current?.open) modal.current?.showModal();
  }, [aberto]);

  async function abrirFichas() {
    setVendoFichas(true);
    if (carregadas && fichasPacienteId === paciente?.id) return;
    if (carregandoFichas) return;

    const nutricionistaId = getSessao()?.id || getSessao()?._id;
    if (!nutricionistaId || !paciente?.id) {
      setErroFichas("Não foi possível identificar o nutricionista ou o paciente.");
      return;
    }

    try {
      setErroFichas("");
      setCarregandoFichas(true);
      setFichas([]);
      setCarregadas(false);
      const resultado = await listarAnamneses(nutricionistaId, paciente.id);
      setFichas(resultado);
      setIndiceFicha(0);
      setFichasPacienteId(paciente.id);
      setCarregadas(true);
    } catch (error) {
      setErroFichas(error.message);
    } finally {
      setCarregandoFichas(false);
    }
  }

  function fecharModal() {
    setVendoFichas(false);
    setEditando(false);
    setConfirmarExclusao(false);
    modal.current?.close();
    fechar();
  }

  function iniciarEdicao() {
    setFormulario({
      nome: paciente.nome || "",
      sobrenome: paciente.sobrenome || "",
      email: paciente.email || "",
      nascimento: typeof paciente.nascimento === "string"
        ? paciente.nascimento.slice(0, 10)
        : paciente.nascimento
          ? new Date(paciente.nascimento).toISOString().slice(0, 10)
          : "",
      genero: paciente.genero || "",
      telefone: paciente.telefone || "",
    });
    setErroAcao("");
    setAvisoAcao("");
    setEditando(true);
  }

  function atualizarCampo(evento) {
    const { name, value } = evento.target;
    setFormulario((atual) => ({ ...atual, [name]: value }));
  }

  async function salvarEdicao(evento) {
    evento.preventDefault();
    setErroAcao("");
    setAvisoAcao("");
    try {
      setSalvando(true);
      const resposta = await request(`/perfil/${paciente.id}`, {
        method: "PATCH",
        body: JSON.stringify(formulario),
      });
      onAtualizado?.(resposta.usuario);
      setEditando(false);
      setAvisoAcao("Dados do paciente atualizados.");
    } catch (error) {
      setErroAcao(error.message);
    } finally {
      setSalvando(false);
    }
  }

  async function excluirPaciente() {
    setErroAcao("");
    try {
      setExcluindo(true);
      await request(`/usuarios/${paciente.id}`, { method: "DELETE" });
      onExcluido?.(paciente.id);
      fecharModal();
    } catch (error) {
      setErroAcao(error.message);
    } finally {
      setExcluindo(false);
    }
  }

  function iniciais(nome = "") {
    return nome
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((parte) => parte[0].toUpperCase())
      .join("");
  }

  return (
    <dialog
      ref={modal}
      onClose={() => {
        if (aberto) fechar();
      }}
      className="m-auto max-h-[92vh] w-[min(42rem,calc(100%-2rem))] overflow-hidden rounded-3xl bg-transparent p-0 text-left shadow-2xl backdrop:bg-gray-950/60 backdrop:backdrop-blur-sm"
    >
      {paciente && (
        <div className="flex max-h-[92vh] flex-col overflow-hidden rounded-3xl border border-gray-200 bg-gray-100">
          <header className="relative shrink-0 overflow-hidden bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600 px-5 py-5 text-white sm:px-7">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-8 -top-16 h-48 w-48 rounded-full border-[26px] border-white/[0.08]"
            />
            <div className="relative flex items-center gap-4">
              {vendoFichas ? (
                <button
                  type="button"
                  onClick={() => setVendoFichas(false)}
                  aria-label="Voltar aos dados do paciente"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 transition hover:bg-white/20"
                >
                  <ArrowLeft size={20} aria-hidden="true" />
                </button>
              ) : (
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-sm font-bold">
                  {iniciais(paciente.nome)}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-200">
                  {vendoFichas ? "Prontuário nutricional" : "Paciente"}
                </p>
                <h2 className="mt-1 truncate text-lg font-bold sm:text-xl">
                  {vendoFichas
                    ? "Fichas de anamnese"
                    : editando
                      ? "Editar dados do paciente"
                      : paciente.nome}
                </h2>
                <p className="mt-1 text-sm text-gray-200">
                  {vendoFichas
                    ? fichas.length
                      ? `Consulta ${indiceFicha + 1} de ${fichas.length}`
                      : "Nenhuma ficha encontrada"
                    : `ID ${paciente.idVisual}`}
                </p>
              </div>
              <button
                type="button"
                onClick={fecharModal}
                aria-label="Fechar detalhes do paciente"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 transition hover:bg-white/20"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-7">
            {vendoFichas ? (
              <section aria-label="Fichas de anamnese do paciente">
                {carregandoFichas && (
                  <p className="rounded-2xl border border-gray-200 bg-white p-5 text-center text-gray-600">
                    Carregando fichas de anamnese...
                  </p>
                )}
                {erroFichas && (
                  <p role="alert" className="rounded-2xl bg-red-100 p-4 text-red-700">
                    {erroFichas}
                  </p>
                )}
                {!carregandoFichas && !erroFichas && fichas.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
                    <ClipboardList className="mx-auto text-gray-600" size={30} aria-hidden="true" />
                    <p className="mt-3 font-semibold text-gray-800">
                      Nenhuma ficha de anamnese encontrada.
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      As fichas preenchidas para as consultas aparecerão aqui.
                    </p>
                  </div>
                )}
                {fichas.length > 0 && (() => {
                  const ficha = fichas[indiceFicha];
                  if (!ficha) return null;
                    const dados =
                      ficha.anamnese?.dados &&
                      typeof ficha.anamnese.dados === "object"
                        ? ficha.anamnese.dados
                        : ficha.anamnese || {};
                    const respostas = Object.entries(dados)
                      .map(([chave, valor]) => ({
                        rotulo: formatarRotulo(chave),
                        valor: formatarValor(valor),
                      }))
                      .filter((item) => item.valor);

                    return (
                      <div>
                      <article
                        key={ficha._id || ficha.numero}
                        className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                      >
                        <div className="flex flex-col gap-3 border-b border-gray-100 bg-gray-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="font-bold text-gray-900">
                              {ficha.tipoAnamnese === "acompanhamento"
                                ? "Ficha de acompanhamento"
                                : ficha.tipoAnamnese === "inicial"
                                  ? "Ficha inicial"
                                  : "Ficha de anamnese"}
                            </p>
                            <p className="mt-1 text-sm text-gray-600">
                              Consulta #{ficha.numero} · {formatarData(ficha.data)} às {ficha.horario}
                            </p>
                          </div>
                          <span className="self-start rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700 sm:self-auto">
                            {ficha.status}
                          </span>
                        </div>
                        {respostas.length ? (
                          <dl className="grid gap-3 p-4 sm:grid-cols-2">
                            {respostas.map((resposta) => (
                              <div
                                key={resposta.rotulo}
                                className="rounded-xl border border-gray-100 bg-gray-50 p-3"
                              >
                                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                  {resposta.rotulo}
                                </dt>
                                <dd className="mt-1 break-words text-sm font-medium text-gray-900">
                                  {resposta.valor}
                                </dd>
                              </div>
                            ))}
                          </dl>
                        ) : (
                          <p className="p-4 text-sm text-gray-500">
                            Esta ficha não possui respostas disponíveis.
                          </p>
                        )}
                      </article>
                      <nav
                        aria-label="Navegação entre fichas"
                        className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-3"
                      >
                        <button
                          type="button"
                          disabled={indiceFicha === 0}
                          onClick={() => setIndiceFicha((indice) => Math.max(0, indice - 1))}
                          className="inline-flex min-h-10 items-center gap-1 rounded-xl border border-gray-300 px-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <ChevronLeft size={18} aria-hidden="true" />
                          Anterior
                        </button>
                        <span className="text-sm font-medium text-gray-600">
                          Consulta {indiceFicha + 1} de {fichas.length}
                        </span>
                        <button
                          type="button"
                          disabled={indiceFicha >= fichas.length - 1}
                          onClick={() =>
                            setIndiceFicha((indice) => Math.min(fichas.length - 1, indice + 1))
                          }
                          className="inline-flex min-h-10 items-center gap-1 rounded-xl border border-gray-300 px-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Próxima
                          <ChevronRight size={18} aria-hidden="true" />
                        </button>
                      </nav>
                      </div>
                    );
                  })()}
                </section>
            ) : editando ? (
              <form id="editar-paciente-form" onSubmit={salvarEdicao} className="space-y-4">
                <div className="mb-4 flex items-center gap-2">
                  <span className="h-5 w-1 rounded-full bg-gray-500" />
                  <h3 className="font-bold text-gray-900">Editar dados cadastrais</h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    ["nome", "Nome", "text"],
                    ["sobrenome", "Sobrenome", "text"],
                    ["email", "E-mail", "email"],
                    ["nascimento", "Data de nascimento", "date"],
                    ["telefone", "Telefone", "tel"],
                  ].map(([name, label, type]) => (
                    <label key={name} className="block text-sm font-semibold text-gray-700">
                      {label}
                      <input
                        required={name !== "telefone"}
                        type={type}
                        name={name}
                        value={formulario?.[name] || ""}
                        onChange={atualizarCampo}
                        className="mt-1 h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                      />
                    </label>
                  ))}
                  <label className="block text-sm font-semibold text-gray-700">
                    Gênero
                    <select
                      required
                      name="genero"
                      value={formulario?.genero || ""}
                      onChange={atualizarCampo}
                      className="mt-1 h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                    >
                      <option value="">Selecione</option>
                      <option value="masculino">Masculino</option>
                      <option value="feminino">Feminino</option>
                      <option value="outro">Outro</option>
                    </select>
                  </label>
                </div>
                {erroAcao && <p role="alert" className="rounded-xl bg-red-100 p-3 text-sm text-red-700">{erroAcao}</p>}
              </form>
            ) : (
              <>
                <div className="mb-4 flex items-center gap-2">
                  <span className="h-5 w-1 rounded-full bg-gray-500" />
                  <h3 className="font-bold text-gray-900">Informações do paciente</h3>
                </div>
                <dl className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Nome completo</dt>
                    <dd className="mt-1 font-semibold text-gray-900">{paciente.nome || "Não informado"}</dd>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">ID do paciente</dt>
                    <dd className="mt-1 font-semibold text-gray-900">#{paciente.idVisual}</dd>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                    <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      <CalendarDays size={14} aria-hidden="true" /> Data de nascimento
                    </dt>
                    <dd className="mt-1 font-semibold text-gray-900">{formatarDataPaciente(paciente.nascimento)}</dd>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                    <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      <Phone size={14} aria-hidden="true" /> Telefone
                    </dt>
                    <dd className="mt-1 font-semibold text-gray-900">{paciente.telefone || "Não informado"}</dd>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:col-span-2">
                    <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      <Mail size={14} aria-hidden="true" /> E-mail
                    </dt>
                    <dd className="mt-1 break-all font-semibold text-gray-900">{paciente.email || "Não informado"}</dd>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:col-span-2">
                    <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      <Clock3 size={14} aria-hidden="true" /> Última consulta
                    </dt>
                    <dd className="mt-1 font-semibold text-gray-900">
                      {paciente.data
                        ? `${formatarData(paciente.data)}${paciente.hora ? ` às ${paciente.hora}` : ""}`
                        : "Nenhuma consulta registrada"}
                    </dd>
                  </div>
                </dl>
              </>
            )}
          </div>

          {avisoAcao && !editando && !vendoFichas && (
            <p role="status" className="mx-5 mb-3 rounded-xl bg-gray-200 p-3 text-sm text-gray-800 sm:mx-7">
              {avisoAcao}
            </p>
          )}
          <footer className="flex shrink-0 flex-col gap-3 border-t border-gray-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            {vendoFichas ? (
              <button
                type="button"
                onClick={() => setVendoFichas(false)}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                <ArrowLeft size={17} aria-hidden="true" />
                Voltar aos dados
              </button>
            ) : editando ? (
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    setEditando(false);
                    setErroAcao("");
                  }}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  form="editar-paciente-form"
                  disabled={salvando}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gray-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-900 disabled:opacity-50"
                >
                  <Save size={17} aria-hidden="true" />
                  {salvando ? "Salvando..." : "Salvar alterações"}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={abrirFichas}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gray-800 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-600 focus-visible:ring-offset-2"
              >
                <ClipboardList size={17} aria-hidden="true" />
                Acessar fichas de anamnese
              </button>
            )}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              {!vendoFichas && !editando && (
                <>
                  <button
                    type="button"
                    onClick={iniciarEdicao}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                  >
                    <Pencil size={17} aria-hidden="true" />
                    Editar dados
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setErroAcao("");
                      setConfirmarExclusao(true);
                    }}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-200"
                  >
                    <Trash2 size={17} aria-hidden="true" />
                    Excluir paciente
                  </button>
                </>
              )}
              {!editando && (
                <button
                  type="button"
                  onClick={fecharModal}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                >
                  <X size={17} aria-hidden="true" />
                  Fechar
                </button>
              )}
            </div>
          </footer>
          {confirmarExclusao && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-950/40 p-4 backdrop-blur-sm">
              <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirmar-exclusao-titulo"
                className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl"
              >
                <h3 id="confirmar-exclusao-titulo" className="text-lg font-bold text-gray-900">
                  Excluir cadastro do paciente?
                </h3>
                <p className="mt-2 text-sm leading-5 text-gray-600">
                  O perfil de {paciente.nome} será removido. Esta ação não pode ser desfeita.
                </p>
                {erroAcao && <p role="alert" className="mt-3 rounded-xl bg-red-100 p-3 text-sm text-red-700">{erroAcao}</p>}
                <div className="mt-5 flex justify-end gap-2">
                  <button
                    type="button"
                    disabled={excluindo}
                    onClick={() => setConfirmarExclusao(false)}
                    className="min-h-10 rounded-xl border border-gray-300 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    disabled={excluindo}
                    onClick={excluirPaciente}
                    className="min-h-10 rounded-xl bg-gray-800 px-4 text-sm font-semibold text-white hover:bg-gray-900 disabled:opacity-50"
                  >
                    {excluindo ? "Excluindo..." : "Confirmar exclusão"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </dialog>
  );
}

export default ModalPaciente;
