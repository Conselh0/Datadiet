import { Link } from "react-router-dom";
import { LogIn } from 'lucide-react';
import "../index.css";

function CadNu() {
  return (
    // min-h-screen com py-8 e px-4 para total responsividade e rolagem suave no mobile
    <main className="font-poppins bg-orange-50/50 bg-full flex items-center justify-center bg-[url('./img/bolas.png')] min-h-screen py-8 px-4">
      {/* Container fluído com w-full max-w-2xl para alinhar perfeitamente com a outra tela */}
      <section className="w-full max-w-2xl p-6 rounded-2xl bg-taupe-50/70 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold">Criar conta de nutricionista</h2>
          <Link to="/">
            {/* Ícone atualizado com o tamanho exato (h-10 w-12 sm:h-11 sm:w-15) e bordas iguais ao anterior */}
            <LogIn
              color="#ffffff"
              className="cursor-pointer h-10 w-12 sm:h-10 sm:w-12 p-2 bg-green-700 rounded-xl sm:rounded-xl transition-transform active:scale-95"
            />
          </Link>
        </div>

        <form method="post">
          {/* Grid responsivo: 1 coluna no celular, 2 colunas a partir do breakpoint 'md' */}
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

            {/* CRN */}
            <div className="flex flex-col">
              <label htmlFor="crn" className="text-base sm:text-lg font-medium mb-1">
                CRN:
              </label>
              <input
                id="crn"
                type="text"
                placeholder="0000-000/SP"
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

            {/* Especialização */}
            <div className="flex flex-col">
              <label htmlFor="especializacao" className="text-base sm:text-lg font-medium mb-1">
                Sua especialização:
              </label>
              <select 
                id="especializacao"
                defaultValue=""
                className="bg-white shadow-md rounded-lg h-10 text-base text-black/50 px-3 cursor-pointer w-full"
              >
                <option value="" disabled>
                  Selecione a Especialização
                </option>
                <option value="Clinica e Hospitalar">
                  Nutrição Clínica e Hospitalar
                </option>
                <option value="Esportiva">Nutrição Esportiva</option>
                <option value="Materno-Infantil">Nutrição Materno-Infantil</option>
                <option value="Comportamental e Emagrecimento">
                  Nutrição Comportamental e Emagrecimento
                </option>
                <option value="Estetica">Nutrição Estética</option>
                <option value="Funcional e Fitoterapia">
                  Nutrição Funcional e Fitoterapia
                </option>
              </select>
            </div>

          </div>

          {/* Botão Inferior Centralizado e Adaptável */}
          <div className="flex flex-col items-center mt-8">
            <Link to="/Admin" className="w-full max-w-md">
              <button type="submit" className="cursor-pointer bg-green-700 w-full h-12 shadow-md rounded-lg text-white font-bold transition-transform active:scale-95">
                Criar conta
              </button>
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}

export default CadNu;
