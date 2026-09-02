import { Link } from "react-router-dom";
import { CircleArrowLeft } from "lucide-react";

function CadNu() {
  return (
    <main className="bg-orange-50/50 bg-full flex items-center bg-[url('./img/bolas.png')] h-[100vh]">
      <section className="w-135 mx-auto p-4 rounded-2xl bg-taupe-50/70 shadow-2xl">
        <Link to="/">
          <CircleArrowLeft
            color="#ffffff"
            className="cursor-pointer absolute ml-117 size-10  p-1.5 bg-green-700 rounded-2xl"
          />
        </Link>

        <h2 className="text-3xl mb-4">Criar conta de nutricionista</h2>
        {/*Textos de Nome e sobrenome kk*/}
        <form method="post" className="">
          <label for="text" className="text-lg mt-5 font-medium ">
            Nome:
          </label>
          <label for="text" className="ml-54 font-semibold">
            Sobrenome:
          </label>

          {/*Input de nome e sobrenome kk*/}
          <br />
          <input
            type="text"
            placeholder="   Digite o seu nome"
            className="bg-white shadow-md rounded-lg w-60 h-10 mb-5"
          />

          <input
            type="text"
            placeholder="   Digite o seu sobrenome"
            minlength="8"
            className="bg-white shadow-md rounded-lg w-60 h-10 ml-5"
          />
          <br />

          {/*Input de Nascimento e email kk*/}
          <label for="text" className="text-lg mt-5 font-me">
            Nascimento:
          </label>
          <label for="email" className="ml-42 font-semibold">
            E-mail:
          </label>

          {/*Input de Nascimento e email kk*/}
          <br />
          <input
            type="text"
            placeholder="   DD/MM/AAAA"
            className="bg-white shadow-md rounded-lg w-60 h-10 mb-5"
          />

          <input
            type="email"
            placeholder="   seu@email.com"
            className="bg-white shadow-md rounded-lg w-60 h-10 ml-5"
          />
          <br />

          {/*Input de Nascimento e email kk*/}
          <label for="text" className="text-lg mt-5 font-me">
            Senha:
          </label>
          <label for="text" className="ml-53 font-semibold">
            Confirmar senha:
          </label>

          {/*Input de Nascimento e email kk*/}
          <br />
          <input
            type="text"
            placeholder="   Digite sua senha"
            className="bg-white shadow-md rounded-lg w-60 h-10 mb-5"
          />

          <input
            type="text"
            placeholder="   Confirme sua senha"
            className="bg-white shadow-md rounded-lg w-60 h-10 ml-5"
          />
          <br />

          {/*Input de Nascimento e email kk*/}
          <label for="text" className="text-lg mt-5 font-me">
            CPF:
          </label>
          <label for="text" className="ml-57 font-semibold">
            CRN:
          </label>

          {/*Input de Nascimento e email kk*/}
          <br />
          <input
            type="text"
            placeholder="   Digite o seu CPF"
            className="bg-white shadow-md rounded-lg w-60 h-10 mb-5"
          />

          <input
            type="text"
            placeholder="   0000-000/SP"
            className="bg-white shadow-md rounded-lg w-60 h-10 ml-5"
          />
          <br />

          <label for="text" className="text-lg mt-5 font-me">
            Telefone:
          </label>

          <label className="font-semibold ml-47"> Sua especialização: </label>

          <br />

          <input
            type="text"
            placeholder="   (00) 00000-0000"
            className="bg-white shadow-md rounded-lg w-60 h-10 mb-5"
          />

          <select className="bg-white shadow-md rounded-lg w-60 h-10 mb-5text-lg text-black/50 cursor-pointer ml-5">
            <option value="" disabled selected>
              {" "}
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

          <center>
            <Link to="/Admin">
            <button className="cursor-pointer bg-green-700 mx-auto shadow-md rounded-lg w-80 h-10 text-white">
              <b>Criar conta</b>
            </button>
            </Link>
          </center>
          <br />
        </form>
      </section>
    </main>
  );
}

export default CadNu;
