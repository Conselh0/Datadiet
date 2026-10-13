// Quem está logado fica em localStorage.usuario, com um "tipo":
//   { ...dados, tipo: "paciente" }  ou  { id, nome, tipo: "nutricionista" }
// Assim a Navbar (que já olha para "usuario") reconhece os dois.

export function getSessao() {
  try {
    return JSON.parse(localStorage.getItem("usuario")) || null;
  } catch {
    return null;
  }
}

export const ehNutricionista = (sessao = getSessao()) => sessao?.tipo === "nutricionista";

export function iniciarSessao(tipo, dados) {
  localStorage.setItem("usuario", JSON.stringify({ ...dados, tipo }));
}

export function sair() {
  localStorage.removeItem("usuario");
  localStorage.removeItem("nutricionista"); // chave antiga, por garantia
}
