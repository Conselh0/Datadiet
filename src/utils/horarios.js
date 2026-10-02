const pad = (n) => String(n).padStart(2, "0");

// "AAAA-MM-DD HH:MM" no horário de Brasília (compara como texto)
export const agora = () =>
  new Date()
    .toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" })
    .slice(0, 16);

// gerarHorarios("08:00", "12:00", 30) -> ["08:00","08:30",...,"11:30"]
export function gerarHorarios(inicio, fim, duracao = 30) {
  const toMin = (h) => {
    const [a, b] = h.split(":").map(Number);
    return a * 60 + b;
  };
  const lista = [];
  for (let m = toMin(inicio); m + duracao <= toMin(fim); m += duracao) {
    lista.push(`${pad(Math.floor(m / 60))}:${pad(m % 60)}`);
  }
  return lista;
}

// Dia da semana (0 = domingo ... 6 = sábado) de "AAAA-MM-DD"
export const diaDaSemana = (data) => new Date(`${data}T12:00:00`).getDay();
