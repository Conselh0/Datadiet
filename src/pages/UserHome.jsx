import DataAgendamentos from "../components/DataAgendamentos";
import { Settings } from "lucide-react";
import { useRef } from "react";

function UserHome() {
  const modal = useRef();

  function abrirModal() {
    modal.current.showModal();
  }

  return (
    <main className="w-full p-4 lg:p-10 min-h-screen flex flex-col lg:block items-center">
      <div className="text-green-950 font-bold text-center lg:text-start">
        <h1 className="text-5xl ">Ana Clara</h1>
        <p className="text-2xl">ID: 0001</p>
      </div>
      <div className="bg-green-950 text-white w-full lg:w-[60vw] p-4 min-h-96 rounded-xl text-xl lg:text-3xl flex flex-col justify-between mb-10">
        <button className="absolute" onClick={abrirModal}>
          <Settings className="cursor-pointer absolute ml-168 size-13 p-1.5 bg-green-700 rounded-2xl" />
        </button>

        <dialog
          ref={modal}
          className="rounded-xl bg-taupe-50/90 backdrop:backdrop-blur-[5px] mt-50 ml-50 h-152 w-150 p-5 "
        >
          <div className="bg-white p-5 rounded-xl shadow-md">
            <p>Editar perfil</p>

            <label for="text" className="text-lg mt-5 ">
              Nome:
            </label>
            <label for="text" className="text-lg ml-52">
              Sobrenome:
            </label>

            <br />
            <input
              type="text"
              placeholder="   Digite o seu nome"
              className="bg-gray-50 shadow-md rounded-lg w-60 h-10 mb-5 text-lg"
            />

            <input
              type="text"
              placeholder="   Digite o seu sobrenome"
              minlength="8"
              className="bg-gray-50 shadow-md rounded-lg w-60 h-10 ml-5 text-lg"
            />

            <br />

            <label for="text" className="text-lg mt-5 ">
              Data de nascimento:
            </label>

            <label for="text" className="text-lg mt-5 ml-25 ">
              Gênero:
            </label>

            <br />
            <input
              type="text"
              placeholder="   Digite o seu nome"
              className="bg-gray-50 shadow-md rounded-lg w-60 h-10 mb-5 text-lg"
            />

            <select className="bg-gray-50 shadow-md rounded-lg w-60 h-10 mb-5 ml-5 text-lg text-black/50">
              <option value="" disabled selected className="text-lg">
                Selecione seu gênero
              </option>

              <option value="Clinica e Hospitalar">Homem</option>
              <option value="Esportiva">Mulher</option>
              <option value="Materno-Infantil">Prefiro não responder</option>
              <option value="Comportamental e Emagrecimento">Outro</option>
            </select>
          </div>
          <br />

          <div className="bg-white p-5 rounded-xl shadow-md">
            <p>Editar perfil</p>
            <p className="text-base">
              Caso queira editar o seu e-mail você tera que clicar no botão a
              baixo <br />e preencher os dados exigidos.
            </p>

            <div className="mt-3">
              <button className="cursor-pointer bg-green-700 p-2 rounded-md text-lg text-white">
                Editar email
              </button>
            </div>
          </div>

          <br />

          <button
            onClick={() => modal.current.close()}
            className="cursor-pointer bg-green-700 p-2 rounded-md text-lg text-white w-full"
          >
            Salvar
          </button>
        </dialog>

        <div>
          <p className="p-3">
            <b>Nome:</b> Ana Clara
          </p>

          <p className="p-3">
            <b>Data</b> de Nascimento: 20/01/2000
          </p>
          <p className="p-3">
            <b>E-mail:</b> ana@hotmail.com
          </p>
          <p className="p-3">
            <b>Gênero:</b> Feminino
          </p>
        </div>
      </div>
      <DataAgendamentos />
    </main>
  );
}

export default UserHome;
