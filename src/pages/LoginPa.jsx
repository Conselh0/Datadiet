import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CircleArrowLeft } from "lucide-react";
import { iniciarSessao } from "../utils/sessao";

const API = "http://localhost:8080";

async function postar(url, corpo) {
  const resposta = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(corpo),
  });
  const dados = await resposta.json().catch(() => ({}));
  return { ok: resposta.ok, dados };
}

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
      const credenciais = { email, senha };

      // 1) Tenta entrar como paciente (login que já existia)
      const paciente = await postar(`${API}/login`, credenciais);
      if (paciente.ok) {
        // Salva os dados do usuário para a Navbar reconhecer
        // que existe um usuário logado.
        iniciarSessao("paciente", paciente.dados.usuario);
        navigate("/User");
        return;
      }

      // 2) Se não for paciente, tenta como nutricionista
      const nutri = await postar(`${API}/login/nutricionista`, credenciais);
      if (nutri.ok) {
        // Mesma chave do paciente (a Navbar reconhece), com tipo "nutricionista"
        iniciarSessao("nutricionista", nutri.dados.nutricionista);
        navigate("/Admin");
        return;
      }

      // Não achou em nenhum dos dois
      setErro(paciente.dados.erro || nutri.dados.erro || "Não foi possível entrar.");
    } catch (error) {
      console.error("Erro ao realizar login:", error);
      setErro("Não foi possível conectar ao servidor.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="font-poppins bg-orange-50/50 bg-full flex items-center justify-center bg-[url('./img/bolas.png')] min-h-screen py-8 px-4">
      <section className="w-full max-w-md p-6 rounded-2xl bg-taupe-50/70 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Entrar</h2>

          <Link to="/">
            <CircleArrowLeft
              color="#ffffff"
              className="cursor-pointer h-10 w-10 p-2 bg-green-700 rounded-xl transition-transform active:scale-95"
            />
          </Link>
        </div>

        <form method="post" onSubmit={entrar} className="flex flex-col gap-4">
          {/* Campo: E-mail */}
          <div className="flex flex-col">
            <label htmlFor="email" className="text-lg font-medium mb-1">
              E-mail:
            </label>

            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              className="bg-white shadow-md rounded-lg w-full h-10 px-3"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          {/* Campo: Senha (sem minLength: no login não se valida o tamanho da senha) */}
          <div className="flex flex-col">
            <label htmlFor="password" className="text-lg font-medium mb-1">
              Senha:
            </label>

            <input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              className="bg-white shadow-md rounded-lg w-full h-10 px-3"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              required
            />
          </div>

          {/* Link Esqueceu a Senha */}
          <div className="text-right -mt-2">
            <Link
              to="/RedefinirSenha"
              className="text-gray-400 text-sm hover:underline cursor-pointer"
            >
              Esqueceu a senha?
            </Link>
          </div>

          {/* Mensagem de erro */}
          {erro && (
            <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg p-3 text-sm">
              {erro}
            </div>
          )}

          {/* Botões e Links de Acesso inferiores */}
          <div className="flex flex-col items-center gap-4 mt-4">
            <button
              type="submit"
              disabled={carregando}
              className="cursor-pointer bg-green-700 hover:bg-green-800 w-full h-12 shadow-md rounded-lg text-white font-bold transition-transform active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {carregando ? "Entrando..." : "Entrar"}
            </button>

            <Link
              to="/CadPa"
              className="text-gray-400 hover:text-gray-600 hover:underline text-sm"
            >
              Criar conta
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}

export default LoginUs;
