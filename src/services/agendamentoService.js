export const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

export async function request(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const erro = new Error(body.erro || "Não foi possível concluir a ação.");
    erro.status = res.status;
    throw erro;
  }
  return body;
}

export function getUsuario() {
  try {
    return JSON.parse(localStorage.getItem("usuario")) || {};
  } catch {
    return {};
  }
}

// O id do usuário pode estar em _id ou id
export const getUsuarioId = () => {
  const u = getUsuario();
  return u._id || u.id;
};

const qs = (obj) =>
  new URLSearchParams(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== "")
  ).toString();

export const criarAgendamento = (dados) => {
  const usuarioLogado = getUsuario();

  const dadosCompletos = {
    ...dados,
    paciente: usuarioLogado.nome,
    pacienteId: usuarioLogado._id || usuarioLogado.id,
  };

  return request("/agendamento", {
    method: "POST",
    body: JSON.stringify(dadosCompletos),
  });
};

export const listarAgendamentos = (filtros = {}) =>
  request(`/agendamentos?${qs(filtros)}`);

export const buscarProximaConsulta = (pacienteId) =>
  request(`/agendamentos/proximo?${qs({ pacienteId })}`);

export const buscarStatusAnamnese = (pacienteId) =>
  request(`/pacientes/${pacienteId}/anamneses/status`);

export const atualizarStatus = (id, status) =>
  request(`/agendamento/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

// Pedido de reagendamento/cancelamento (ou proposta de novo horário do nutricionista)
// dados: { tipo, origem, novaData?, novoHorario?, motivo? }
export const solicitarAlteracao = (id, dados) =>
  request(`/agendamento/${id}/solicitacao`, {
    method: "POST",
    body: JSON.stringify(dados),
  });

// por: "paciente" | "nutricionista" (quem está respondendo)
export const responderSolicitacao = (id, por, aceitar) =>
  request(`/agendamento/${id}/solicitacao/responder`, {
    method: "POST",
    body: JSON.stringify({ por, aceitar }),
  });

// por: quem fez o pedido
export const retirarSolicitacao = (id, por) =>
  request(`/agendamento/${id}/solicitacao?${qs({ por })}`, { method: "DELETE" });
