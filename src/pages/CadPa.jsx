import { LogIn } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cpfValido, limparCpf } from "../utils/cpf.js";

function CadPa() {
  const navigate = useNavigate();

  // Pegando os dados e armazenando nos states
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [genero, setGenero] = useState("");
  const [erroCpf, setErroCpf] = useState("");

  // O clique do botão chama essa função que envia para o cadastro
  async function salvar() {
    if (!cpfValido(cpf)) {
      setErroCpf("Digite um CPF válido.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          sobrenome,
          nascimento,
          email,
          senha,
          confirmarSenha,
          cpf: limparCpf(cpf), //Substitui a formtação pro cpf ser cadastrado da maneira certa no banco
          telefone: telefone.replace(/\D/g, ""), //Faz a mesma coisa que o CPF
          genero,
        }),
      });

      // Pega a resposta do servidor e transforma o JSON em um objeto
      const data = await res.json().catch(() => ({}));
      console.log(data);

      // Pegando a mensagem acima e trabalhando dentro do if
      // Se conseguirmos receber a mensagem que o servidor está enviando,
      // vamos para o /User
      if (data.mensagem) {
        navigate("/User");
      } else {
        // Senão mostramos a mensagem ao usuário
        alert(data.erro || "Erro desconhecido");
      }

      // Avisa o erro ao tentar conexão com o servidor
    } catch (error) {
      console.error("Erro no fetch:", error);
      alert("Erro ao conectar com o servidor");
    }
  }

  return (
    // Mudado h-[100vh] para min-h-screen com py-8 para garantir
    // que nenhum conteúdo seja cortado em telas pequenas
    <main className="font-poppins bg-orange-50/50 bg-full flex items-center justify-center bg-[url('./img/bolas.png')] min-h-screen py-8 px-4">
      {/* w-full max-w-2xl garante que ele estique no celular
          e pare em um tamanho ideal no computador */}
      <section className="w-full max-w-2xl p-6 rounded-xl bg-taupe-50/70 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold">Criar conta</h2>

          <Link to="/">
            <LogIn
              color="#ffffff"
              className="cursor-pointer h-10 w-12 sm:h-10 sm:w-12 p-2 bg-green-700 rounded-xl transition-transform active:scale-95"
            />
          </Link>
        </div>

        <form
          method="post"
          onSubmit={(e) => {
            e.preventDefault();
            salvar();
          }}
        >
          {/* grid-cols-1 no celular e md:grid-cols-2 no computador */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
            {/* Nome */}
            <div className="flex flex-col">
              <label
                htmlFor="nome"
                className="text-base sm:text-lg font-medium mb-1"
              >
                Nome:
              </label>

              <input
                id="nome"
                type="text"
                placeholder="Digite o seu nome"
                className="bg-white shadow-md rounded-lg w-full h-10 px-3"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            {/* Sobrenome */}
            <div className="flex flex-col">
              <label
                htmlFor="sobrenome"
                className="text-base sm:text-lg font-medium mb-1"
              >
                Sobrenome:
              </label>

              <input
                id="sobrenome"
                type="text"
                placeholder="Digite o seu sobrenome"
                minLength="2"
                className="bg-white shadow-md rounded-lg w-full h-10 px-3"
                value={sobrenome}
                onChange={(e) => setSobrenome(e.target.value)}
                required
              />
            </div>

            {/* Nascimento */}
            <div className="flex flex-col">
              <label
                htmlFor="nascimento"
                className="text-base sm:text-lg font-medium mb-1"
              >
                Nascimento:
              </label>

              <input
                id="nascimento"
                type="date"
                className="bg-white shadow-md rounded-lg w-full h-10 px-3"
                value={nascimento}
                onChange={(e) => setNascimento(e.target.value)}
                required
              />
            </div>

            {/* E-mail */}
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="text-base sm:text-lg font-medium mb-1"
              >
                E-mail:
              </label>

              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                className="bg-white shadow-md rounded-lg w-full h-10 px-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Senha */}
            <div className="flex flex-col">
              <label
                htmlFor="senha"
                className="text-base sm:text-lg font-medium mb-1"
              >
                Senha:
              </label>

              <input
                id="senha"
                type="password"
                placeholder="Digite sua senha"
                minLength="8"
                className="bg-white shadow-md rounded-lg w-full h-10 px-3"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>

            {/* Confirmar Senha */}
            <div className="flex flex-col">
              <label
                htmlFor="confirmarSenha"
                className="text-base sm:text-lg font-medium mb-1"
              >
                Confirmar senha:
              </label>

              <input
                id="confirmarSenha"
                type="password"
                placeholder="Confirme sua senha"
                minLength="8"
                className="bg-white shadow-md rounded-lg w-full h-10 px-3"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                required
              />
            </div>

            {/* CPF */}
            <div className="flex flex-col">
              <label
                htmlFor="cpf"
                className="text-base sm:text-lg font-medium mb-1"
              >
                CPF:
              </label>

              <input
                id="cpf"
                type="text"
                placeholder="Digite o seu CPF"
                inputMode="numeric"
                maxLength="14"
                aria-invalid={Boolean(erroCpf)}
                aria-describedby={erroCpf ? "cpf-erro" : undefined}
                className={`bg-white shadow-md rounded-lg w-full h-10 px-3 ${
                  erroCpf ? "border-2 border-red-500" : ""
                }`}
                value={cpf}
                onChange={(e) => {
                  let valor = e.target.value.replace(/\D/g, "");

                  valor = valor
                    .replace(/^(\d{3})(\d)/, "$1.$2")
                    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
                    .replace(/\.(\d{3})(\d)/, ".$1-$2")
                    .slice(0, 14);

                  setCpf(valor);
                    setErroCpf(
                      valor.length === 14 && !cpfValido(valor)
                        ? "Digite um CPF válido."
                        : "",
                    );
                }}
                required
              />
              {erroCpf && (
                <span id="cpf-erro" className="mt-1 text-sm text-red-600">
                  {erroCpf}
                </span>
              )}
            </div>

            {/* Telefone */}
            <div className="flex flex-col">
              <label
                htmlFor="telefone"
                className="text-base sm:text-lg font-medium mb-1"
              >
                Telefone:
              </label>

              <input
                type="text"
                placeholder="(00) 00000-0000"
                className="bg-white shadow-md rounded-lg w-full h-10 px-3"
                value={telefone}
                onChange={(e) => {
                  let valor = e.target.value.replace(/\D/g, "");

                  valor = valor
                    .replace(/^(\d{2})(\d)/, "($1) $2")
                    .replace(/(\d{5})(\d)/, "$1-$2")
                    .slice(0, 15);

                  setTelefone(valor);
                }}
              />
            </div>

            {/* Gênero - col-span-1 no celular e md:col-span-2 no desktop */}
            <div className="flex flex-col col-span-1 md:col-span-2 w-full max-w-xs">
              <label
                htmlFor="genero"
                className="text-base sm:text-lg font-medium mb-1"
              >
                Gênero:
              </label>

              <select
                id="genero"
                value={genero}
                onChange={(e) => setGenero(e.target.value)}
                className="bg-gray-50 shadow-md rounded-lg h-10 text-base sm:text-lg text-black/50 px-3"
                required
              >
                <option value="" disabled>
                  Selecione uma opção
                </option>

                <option value="M">Homem</option>
                <option value="F">Mulher</option>
                <option value="Outro">Prefiro não responder</option>
              </select>
            </div>
          </div>

          {/* Botões e Links inferiores */}
          <div className="flex flex-col items-center mt-6">
            {/* Botão agora envia o formulário para o backend */}
            <button
              type="submit"
              className="cursor-pointer bg-green-700 w-full max-w-md h-12 shadow-md rounded-lg text-white font-bold transition-transform active:scale-95 hover:bg-green-800"
            >
              Criar conta
            </button>

            <div className="mt-4">
              <Link
                to="/CadNu"
                className="text-gray-400 hover:text-gray-600 text-sm sm:text-base hover:underline"
              >
                Criar conta de nutricionista
              </Link>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}

export default CadPa;
