import { useState } from "react";
import { CircleArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { request } from "../services/agendamentoService";

function RedefinirSenha() {
  const navigate = useNavigate();
  const [formulario, setFormulario] = useState({
    email: "",
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
      const dados = await request("/redefinir-senha", {
        method: "POST",
        body: JSON.stringify({ email: formulario.email }),
      });

      setMensagem(dados.mensagem);
      setTimeout(() => navigate("/LoginPa"), 60000);
    } catch (erroRequisicao) {
      setErro(erroRequisicao.message);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-orange-50/50 bg-[url('./img/bolas.png')] bg-cover bg-center p-4">
      <section className="mx-auto w-full max-w-md rounded-2xl border border-white/70 bg-white/85 p-6 shadow-2xl backdrop-blur-sm sm:p-8">
        <div className="mb-5 flex items-center gap-3">
          <Link
            to="/LoginPa"
            aria-label="Voltar para o login"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-700 text-white transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2"
          >
            <CircleArrowLeft size={24} aria-hidden="true" />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
            Redefinir senha
          </h1>
        </div>
        <p className="mb-6 text-sm leading-relaxed text-gray-600 sm:text-base">
          Informe seu e-mail para receber um link. Você poderá escolher uma nova
          senha depois de acessá-lo.
        </p>

        <form onSubmit={redefinir} className="flex flex-col gap-3">
          <label htmlFor="email" className="text-sm font-medium text-gray-800">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formulario.email}
            onChange={atualizarCampo}
            autoComplete="email"
            className="h-11 rounded-lg border border-gray-300 bg-white px-3 text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
          />

          {erro && (
            <p role="alert" className="text-sm text-red-700">
              {erro}
            </p>
          )}
          {mensagem && (
            <p role="status" className="text-sm text-green-800">
              {mensagem}
            </p>
          )}
          <button
            type="submit"
            className="mt-3 h-11 cursor-pointer rounded-lg bg-green-700 font-medium text-white shadow-md transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2"
          >
            Enviar link
          </button>
        </form>
      </section>
    </main>
  );
}

export default RedefinirSenha;