import { request } from "./agendamentoService";

export const listarNutricionistas = () => request("/nutricionistas");

export const cadastrarNutricionista = (dados) =>
  request("/nutricionista", { method: "POST", body: JSON.stringify(dados) });

// -> [{ hora: "08:00", livre: true }, ...]
export const buscarHorarios = (nutricionistaId, data) =>
  request(`/nutricionistas/${nutricionistaId}/horarios?data=${data}`);

// Perfil completo (para a home do próprio nutricionista)
export const buscarNutricionista = (id) => request(`/nutricionista/${id}`);

// Pacientes que já agendaram com o nutricionista
export const listarPacientes = (nutricionistaId) =>
  request(`/nutricionistas/${nutricionistaId}/pacientes`);
