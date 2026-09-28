import { Link } from "react-router-dom";

import { LogIn } from 'lucide-react';

function LoginUs() {
  return (
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
