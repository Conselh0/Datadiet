import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CircleArrowLeft } from "lucide-react";

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
    <main className="bg-orange-50/50 bg-full flex items-center bg-[url('./img/bolas.png')] h-[100vh] ">
      <section className="max-w-90 mx-auto p-4 rounded-2xl bg-taupe-50/70 shadow-2xl">
        <Link to="/">
          <CircleArrowLeft
            color="#ffffff"
            className="cursor-pointer absolute ml-70 size-10  p-1.5 bg-green-700 rounded-2xl"
          />
        </Link>
        <h2 className="text-3xl mb-4">Entrar</h2>

        <form method="post" onSubmit={entrar}>
          <label htmlFor="email" className="text-lg mt-5">
            E-mail:
          </label>
          <br />
          <input
            id="email"
            type="text"
            placeholder="   seu@email.com"
            className="bg-white shadow-md rounded-lg w-80 h-10 mb-5"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <br />

          <label htmlFor="password">Senha:</label>
          <br />
          <input
            id="password"
            type="password"
            placeholder="   Digite sua senha"
            minLength="8"
            className="bg-white shadow-md rounded-lg w-80 h-10"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
            required
          />
          <br />

          <Link to="/RedefinirSenha" className="text-gray-400">
            Esqueceu a senha?
          </Link>
          <br />
          <br />

          {erro && <p className="text-red-700 text-sm mb-3">{erro}</p>}

          <center>
            <button
              type="submit"
              disabled={carregando}
              className="cursor-pointer bg-green-700 mx-auto shadow-md rounded-lg w-80 h-10 text-white disabled:opacity-60"
            >
              <b>{carregando ? "Entrando..." : "Entrar"}</b>
            </button>
          </center>

          <center>
            <Link to="/CadPa" className="text-gray-400">
              Criar conta
            </Link>
          </center>
        </form>
      </section>
    </main>
  );
}

export default LoginUs;
