const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function request(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.erro || "Não foi possível concluir a ação.");
  return body;
}

// AJUSTE AQUI: de onde vem o usuário logado no seu projeto
// (aqui assumimos localStorage.usuario = {"id":"...","nome":"..."})
export function getUsuario() {
  try {
    return JSON.parse(localStorage.getItem("usuario")) || {};
  } catch {
    return {};
  }
}

const qs = (obj) =>
  new URLSearchParams(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== "")
  ).toString();

export const criarAgendamento = (dados) =>
  request("/agendamento", { method: "POST", body: JSON.stringify(dados) });

export const listarAgendamentos = (filtros = {}) =>
  request(`/agendamentos?${qs(filtros)}`);

export const buscarProximaConsulta = (pacienteId) =>
  request(`/agendamentos/proximo?${qs({ pacienteId })}`);

export const buscarHorariosOcupados = (nutricionista, data) =>
  request(`/agendamentos/ocupados?${qs({ nutricionista, data })}`);

export const atualizarStatus = (id, status) =>
  request(`/agendamento/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
