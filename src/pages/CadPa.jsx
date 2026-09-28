import { LogIn } from 'lucide-react';
import { Link } from "react-router-dom";
import "../index.css";

function CadPa() {
  return (
    // Mudado h-[100vh] para min-h-screen com py-8 para garantir que nenhum conteúdo seja cortado em telas pequenas
    <main className="font-poppins bg-orange-50/50 bg-full flex items-center justify-center bg-[url('./img/bolas.png')] min-h-screen py-8 px-4">
      {/* w-full max-w-2xl garante que ele estique no celular e pare em um tamanho ideal no computador */}
      <section className="w-full max-w-2xl p-6 rounded-xl bg-taupe-50/70 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold">Criar conta</h2>
          <Link to="/">
            <LogIn
              color="#ffffff"
              className="cursor-pointer h-10 w-12 sm:h-10 sm:w-12 p-2 bg-green-700 rounded-xl sm:rounded-xl transition-transform active:scale-95"
            />
          </Link>
        </div>
        
        <form method="post">
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
                minLength="8"
                className="bg-white shadow-md rounded-lg w-full h-10 px-3"
              />
            </div>

            {/* Nascimento */}
            <div className="flex flex-col">
              <label htmlFor="nascimento" className="text-base sm:text-lg font-medium mb-1">
                Nascimento:
              </label>
              <input
                id="nascimento"
                type="text"
                placeholder="DD/MM/AAAA"
                className="bg-white shadow-md rounded-lg w-full h-10 px-3"
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
              />
            </div>

            {/* Telefone */}
            <div className="flex flex-col">
              <label htmlFor="telefone" className="text-base sm:text-lg font-medium mb-1">
                Telefone:
              </label>
              <input
                id="telefone"
                type="text"
                placeholder="(00) 00000-0000"
                className="bg-white shadow-md rounded-lg w-full h-10 px-3"
              />
            </div>

            {/* Gênero - col-span-1 no celular e md:col-span-2 no desktop */}
            <div className="flex flex-col col-span-1 md:col-span-2 w-full max-w-xs">
              <label htmlFor="genero" className="text-base sm:text-lg font-medium mb-1">
                Gênero:
              </label>
              <select 
                id="genero" 
                defaultValue=""
                className="bg-gray-50 shadow-md rounded-lg h-10 text-base sm:text-lg text-black/50 px-3"
              >
                <option value="" disabled>
                  Selecione uma opção
                </option>
                <option value="HomemCis">Homem cisgênero</option>
                <option value="MulherCis">Mulher cisgênero</option>
                <option value="Outro">Outro</option>
                <option value="NaoResponder">Prefiro não informar</option>
              </select>
            </div>

          </div>

          {/* Botões e Links inferiores */}
          <div className="flex flex-col items-center mt-6">
            <Link to="/User" className="w-full max-w-md">
              {/* Mudado de w-120 para w-full dentro de um limite max-w-md para se adaptar a qualquer tela */}
              <button type="button" className="cursor-pointer bg-green-700 w-105 h-12 shadow-md rounded-lg text-white font-bold transition-transform active:scale-95">
                Criar conta
              </button>
            </Link>
            <div className="mt-4">
              <Link to="/CadNu" className='text-gray-400 hover:text-gray-600 text-sm sm:text-base hover:underline'>
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
