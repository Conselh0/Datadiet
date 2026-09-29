// "2026-06-20" -> "20/06/2026"
export const formatarData = (iso = "") => iso.split("-").reverse().join("/");

// "Maria Sousa" -> "MS"
export const iniciais = (nome = "") =>
  nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
