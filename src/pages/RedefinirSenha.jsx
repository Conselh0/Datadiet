import { useState } from "react";
import { CircleArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function RedefinirSenha() {
  const navigate = useNavigate();
  const [formulario, setFormulario] = useState({
    email: "",
    cpf: "",
    novaSenha: "",
    confirmarSenha: "",
  });
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  function atualizarCampo(event) {
    setFormulario({ ...formulario, [event.target.name]: event.target.value });
  }

  async function redefinir(event) {
    event.preventDefault();
    setMensagem("");
    setErro("");

    try {
      const resposta = await fetch("http://localhost:8080/redefinir-senha", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formulario),
      });
      const dados = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        setErro(dados.erro || "Não foi possível redefinir a senha.");
        return;
      }

      setMensagem(dados.mensagem);
      setTimeout(() => navigate("/LoginPa"), 1200);
    } catch {
      setErro("Não foi possível conectar ao servidor.");
    }
  }

  return (
    <main className="bg-orange-50/50 flex items-center bg-[url('./img/bolas.png')] min-h-screen p-4">
      <section className="w-full max-w-md mx-auto p-6 rounded-2xl bg-taupe-50/70 shadow-2xl">
        <Link to="/LoginPa" aria-label="Voltar para o login">
          <CircleArrowLeft
            color="#ffffff"
            className="cursor-pointer absolute size-10 p-1.5 bg-green-700 rounded-2xl"
          />
        </Link>
        <h2 className="text-3xl mb-2">Redefinir senha</h2>
        <p className="text-gray-600 mb-6">
          Confirme seus dados para criar uma nova senha.
        </p>

        <form onSubmit={redefinir} className="flex flex-col gap-3">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formulario.email}
            onChange={atualizarCampo}
            className="bg-white shadow-md rounded-lg h-10 px-3"
          />

          <label htmlFor="cpf">CPF</label>
          <input
            id="cpf"
            name="cpf"
            inputMode="numeric"
            maxLength="14"
            required
            value={formulario.cpf}
            onChange={atualizarCampo}
            className="bg-white shadow-md rounded-lg h-10 px-3"
          />

          <label htmlFor="novaSenha">Nova senha</label>
          <input
            id="novaSenha"
            name="novaSenha"
            type="password"
            minLength="8"
            required
            value={formulario.novaSenha}
            onChange={atualizarCampo}
            className="bg-white shadow-md rounded-lg h-10 px-3"
          />

          <label htmlFor="confirmarSenha">Confirmar nova senha</label>
          <input
            id="confirmarSenha"
            name="confirmarSenha"
            type="password"
            minLength="8"
            required
            value={formulario.confirmarSenha}
            onChange={atualizarCampo}
            className="bg-white shadow-md rounded-lg h-10 px-3"
          />

          {erro && <p className="text-red-700 text-sm">{erro}</p>}
          {mensagem && <p className="text-green-800 text-sm">{mensagem}</p>}
          <button
            type="submit"
            className="cursor-pointer bg-green-700 shadow-md rounded-lg h-10 text-white mt-3"
          >
            Redefinir senha
          </button>
        </form>
      </section>
    </main>
  );
}

export default RedefinirSenha;
