<<<<<<< HEAD
import { Link } from "react-router-dom";

import { LogIn } from 'lucide-react';
=======
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CircleArrowLeft } from "lucide-react";
>>>>>>> backend_elias

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
<<<<<<< HEAD
    // Alterado h-[100vh] para min-h-screen com flex justify-center para evitar quebras em telas menores
    <main className="font-poppins bg-orange-50/50 bg-full flex items-center justify-center bg-[url('./img/bolas.png')] min-h-screen py-8 px-4">
      {/* w-full max-w-md garante espaço suficiente para os inputs sem quebrar para os lados */}
      <section className="w-full max-w-md p-6 rounded-2xl bg-taupe-50/70 shadow-2xl">
        
        {/* Topo alinhado sem margens absolutas que quebram o layout */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Entrar</h2>
          <Link to="/">
            <LogIn
              color="#ffffff"
              className="cursor-pointer h-10 w-12 p-2 bg-green-700 rounded-xl transition-transform active:scale-95"
            />
          </Link>
        </div>

        <form method="post" className="flex flex-col gap-4">
          
          {/* Campo: E-mail ou CRN */}
          <div className="flex flex-col">
            <label htmlFor="email" className="text-lg font-medium mb-1">
              E-mail ou CRN:
            </label>
            <input
              id="email"
              type="text"
              placeholder="seu@email.com"
              className="bg-white shadow-md rounded-lg w-full h-10 px-3"
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
            />
          </div>

          {/* Link Esqueceu a Senha */}
          <div className="text-right -mt-2">
            <a href="#" className="text-gray-400 text-sm hover:underline cursor-pointer">
              Esqueceu a senha?
            </a>
          </div>

          {/* Botões e Links de Acesso inferiores */}
          <div className="flex flex-col items-center gap-4 mt-4">
            <Link to="/User" className="w-full">
              {/* O botão agora ocupa 100% do container max-w-md de forma fluida */}
              <button className="cursor-pointer bg-green-700 w-full h-12 shadow-md rounded-lg text-white font-bold transition-transform active:scale-95">
                Entrar
              </button>
            </Link>
=======
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
>>>>>>> backend_elias

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
