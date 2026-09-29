import { CircleArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../index.css";

function CadPa() {
  const navigate = useNavigate();

  // Armazenando os dados nos states
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [genero, setGenero] = useState("");

  // Função que envia os dados para o backend ao submeter o formulário
  async function salvar() {
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
          cpf,
          telefone,
          genero,
        }),
      });

      const data = await res.json().catch(() => ({}));
      console.log(data);

      if (data.mensagem) {
        navigate("/User");
      } else {
        alert(data.erro || "Erro desconhecido");
      }
    } catch (error) {
      console.error("Erro no fetch:", error);
      alert("Erro ao conectar com o servidor");
    }
  }

  return (
    <main className="font-poppins bg-orange-50/50 bg-full flex items-center justify-center bg-[url('./img/bolas.png')] min-h-screen py-8 px-4">
      {/* w-full max-w-2xl garante que ele estique no celular e pare em um tamanho ideal no computador */}
      <section className="w-full max-w-2xl p-6 rounded-xl bg-taupe-50/70 shadow-2xl relative">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold">Criar conta</h2>
          <Link to="/">
            <CircleArrowLeft
              color="#ffffff"
              className="cursor-pointer h-10 w-10 p-1.5 bg-green-700 rounded-xl transition-transform active:scale-95"
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
              <label htmlFor="nome" className="text-base sm:text-lg font-medium mb-1">
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
              <label htmlFor="sobrenome" className="text-base sm:text-lg font-medium mb-1">
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
              <label htmlFor="nascimento" className="text-base sm:text-lg font-medium mb-1">
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
              <label htmlFor="email" className="text-base sm:text-lg font-medium mb-1">
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
              <label htmlFor="senha" className="text-base sm:text-lg font-medium mb-1">
                Senha:
              </label>
              <input
                id="senha"
                type="password"
                placeholder="Digite sua senha"
                className="bg-white shadow-md rounded-lg w-full h-10 px-3"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>

            {/* Confirmar Senha */}
            <div className="flex flex-col">
              <label htmlFor="confirmarSenha" className="text-base sm:text-lg font-medium mb-1">
                Confirmar senha:
              </label>
              <input
                id="confirmarSenha"
                type="password"
                placeholder="Confirme sua senha"
                className="bg-white shadow-md rounded-lg w-full h-10 px-3"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                required
              />
            </div>

            {/* CPF */}
            <div className="flex flex-col">
              <label htmlFor="cpf" className="text-base sm:text-lg font-medium mb-1">
                CPF:
              </label>
              <input
                id="cpf"
                type="text"
                placeholder="Digite o seu CPF"
                className="bg-white shadow-md rounded-lg w-full h-10 px-3"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                required
              />
            </div>

            {/* Telefone */}
            <div className="flex flex-col">
              <label htmlFor="telefone" className="text-base sm:text-lg font-medium mb-1">
                Telefone:
              </label>
              <input
                id="telefone"
                type="tel"
                placeholder="(00) 00000-0000"
                className="bg-white shadow-md rounded-lg w-full h-10 px-3"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                required
              />
            </div>

            {/* Gênero (Opcional/Select simples baseado no seu state) */}
            <div className="flex flex-col md:col-span-2">
              <label htmlFor="genero" className="text-base sm:text-lg font-medium mb-1">
                Gênero:
              </label>
              <select
                id="genero"
                className="bg-white shadow-md rounded-lg w-full h-10 px-3"
                value={genero}
                onChange={(e) => setGenero(e.target.value)}
                required
              >
                <option value="">Selecione...</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
                <option value="outro">Outro</option>
              </select>
            </div>

          </div>

          {/* Botão de Enviar */}
          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              className="bg-green-700 text-white font-semibold py-2 px-8 rounded-lg shadow-md hover:bg-green-800 transition-colors w-full sm:w-auto cursor-pointer"
            >
              Cadastrar
            </button>
          </div>

        </form>
      </section>
    </main>
  );
}

export default CadPa;
