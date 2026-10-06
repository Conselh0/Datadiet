import { useEffect, useRef, useState } from "react";
import { CircleArrowLeft } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

function ConfirmarRedefinicaoSenha() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState(token ? "" : "O link de confirmação está incompleto.");
  const confirmado = useRef(false);

  useEffect(() => {
    if (!token || confirmado.current) {
      return;
    }
    confirmado.current = true;

    async function confirmar() {
      try {
        const resposta = await fetch(
          "http://localhost:8080/redefinir-senha/confirmar",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          },
        );
        const dados = await resposta.json().catch(() => ({}));

        if (!resposta.ok) {
          setErro(dados.erro || "Não foi possível confirmar a alteração.");
          return;
        }

        setMensagem(dados.mensagem);
      } catch {
        setErro("Não foi possível conectar ao servidor.");
      }
    }

    confirmar();
  }, [token]);

  return (
    <main className="bg-orange-50/50 flex items-center bg-[url('./img/bolas.png')] min-h-screen p-4">
      <section className="w-full max-w-md mx-auto p-6 rounded-2xl bg-taupe-50/70 shadow-2xl">
        <Link to="/LoginPa" aria-label="Voltar para o login">
          <CircleArrowLeft
            color="#ffffff"
            className="cursor-pointer absolute size-10 p-1.5 bg-green-700 rounded-2xl"
          />
        </Link>
        <h2 className="text-3xl mb-4">Confirmação de senha</h2>
        {erro && <p className="text-red-700 text-sm">{erro}</p>}
        {mensagem && (
          <div className="text-green-800 text-sm">
            <p>{mensagem}</p>
            <Link to="/LoginPa" className="underline">
              Voltar para o login
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}

export default ConfirmarRedefinicaoSenha;
