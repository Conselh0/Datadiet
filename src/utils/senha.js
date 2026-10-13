import crypto from "crypto";

// Guarda a senha como "salt:hash" (scrypt, já vem no Node)
export function hashSenha(senha) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(senha, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

// Use no login: verificarSenha(senhaDigitada, nutricionista.senha)
export function verificarSenha(senha, armazenada = "") {
  const [salt, hash] = armazenada.split(":");
  if (!salt || !hash) return false;
  const teste = crypto.scryptSync(senha, salt, 64);
  const original = Buffer.from(hash, "hex");
  return original.length === teste.length && crypto.timingSafeEqual(original, teste);
}
