export function limparCpf(cpf = "") {
  return typeof cpf === "string" ? cpf.replace(/\D/g, "") : "";
}

export function cpfValido(cpf) {
  const cpfNumerico = limparCpf(cpf);

  if (cpfNumerico.length !== 11 || /^(\d)\1{10}$/.test(cpfNumerico)) {
    return false;
  }

  const calcularDigito = (quantidade) => {
    let soma = 0;

    for (let indice = 0; indice < quantidade; indice += 1) {
      soma += Number(cpfNumerico[indice]) * (quantidade + 1 - indice);
    }

    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  return (
    calcularDigito(9) === Number(cpfNumerico[9]) &&
    calcularDigito(10) === Number(cpfNumerico[10])
  );
}
