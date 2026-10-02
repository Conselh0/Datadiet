import { request } from "./agendamentoService.js";

export const listarNutricionistas = () => request("/nutricionistas");

export const cadastrarNutricionista = (dados) =>
  request("/nutricionista", { method: "POST", body: JSON.stringify(dados) });

// Busca os horários configurados: [{ hora: "08:00", livre: true }, ...]
export const buscarHorarios = (nutricionistaId, data) =>
  request(`/nutricionistas/${nutricionistaId}/horarios?data=${data}`);

