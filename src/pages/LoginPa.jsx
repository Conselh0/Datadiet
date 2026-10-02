import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, CircleArrowLeft } from "lucide-react";

function LoginUs() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function entrar(event) {
    event.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const resposta = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const dados = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        setErro(dados.erro || "Não foi possível entrar.");
        return;
      }

      localStorage.setItem("usuario", JSON.stringify(dados.usuario));
      navigate("/User");
    } catch {
      setErro("Não foi possível conectar ao servidor.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="font-poppins bg-orange-50/50 bg-full flex items-center justify-center bg-[url('./img/bolas.png')] min-h-screen py-8 px-4">
      <section className="w-full max-w-md p-6 rounded-2xl bg-taupe-50/70 shadow-2xl relative">
        
        {/* Topo Alinhado com Botão de Voltar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Entrar</h2>
          <Link to="/">
            <CircleArrowLeft
              color="#ffffff"
              className="cursor-pointer h-10 w-10 p-2 bg-green-700 rounded-xl transition-transform active:scale-95"
            />
          </Link>
        </div>

        {/* Formulário com a função de submit vinculada */}
        <form onSubmit={entrar} className="flex flex-col gap-4">
          
          {/* Campo: E-mail */}
          <div className="flex flex-col">
            <label htmlFor="email" className="text-lg font-medium mb-1">
              E-mail ou CRN:
            </label>
            <input
              id="email"
              type="text"
              placeholder="seu@email.com"
              className="bg-white shadow-md rounded-lg w-full h-10 px-3"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          {/* Campo: Senha */}
          <div className="flex flex-col">
            <label htmlFor="password" className="text-lg font-medium mb-1">
              Senha:
            </label>
            <input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              minLength="8"
              className="bg-white shadow-md rounded-lg w-full h-10 px-3"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              required
            />
          </div>

          {/* Link Esqueceu a Senha */}
          <div className="text-right -mt-1">
            <Link to="/RedefinirSenha" className="text-gray-400 text-sm hover:underline">
              Esqueceu a senha?
            </Link>
          </div>

          {/* Mensagem de Erro Dinâmica */}
          {erro && <p className="text-red-700 text-sm font-medium text-center">{erro}</p>}

          {/* Botões e Links de Acesso */}
          <div className="flex flex-col items-center gap-4 mt-2">
            <button
              type="submit"
              disabled={carregando}
              className="cursor-pointer bg-green-700 w-full h-12 shadow-md rounded-lg text-white font-bold transition-transform active:scale-95 disabled:opacity-60"
            >
              {carregando ? "Entrando..." : "Entrar"}
            </button>

            <Link to="/CadPa" className="text-gray-400 hover:underline text-sm">
              Criar conta
            </Link>
          </div>

        </form>
      </section>
    </main>
  );
}

export default LoginUs;
