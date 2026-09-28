import { UserRoundPen } from "lucide-react";
import Agendamentos from "../components/Agendamentos";
import { Settings } from "lucide-react";
import { useRef, useState } from "react";
import "../index.css";

function AdminHome() {
  const modal = useRef();
  
  const [fechando, setFechando] = useState(false);

  function abrirModal() {
    setFechando(false);
    modal.current.showModal();
  }

  function fecharModal() {
    setFechando(true);

    setTimeout(() => {
      modal.current.close();
      setFechando(false);
    }, 300);
  }
  return (
    <div>
      <div className="w-full p-4 lg:p-10 min-h-screen">
        <div className="ml-2 text-justify">
          <h1 className="text-3xl lg:text-6xl font-bold">Luana Teixeira</h1>{" "}
          <br />
          <p className="lg:text-2xl lg:font-bold">ID: 001</p>{" "}
          {/*Arrumar com props */}  
        </div>

        <main className="relative flex-col w-full bg-gray-600 rounded-xl p-3 h-auto text-white text-xl  lg:text-3xl align-center justify-center text-justify">        
          
          <button className="absolute top-4 right-4" onClick={abrirModal}>
          <Settings className="cursor-pointer size-13 p-1.5 bg-gray-400 rounded-2xl" />
        </button>

        <dialog
          ref={modal}
          className={`rounded-xl overflow-hidden bg-taupe-50/90 h-152 w-150 p-5 fixed top-1/2 left-1/2
  -translate-x-1/2 -translate-y-1/2
    ${
      fechando
        ? "animate-[fecharModal_0.2s_ease-in_forwards]"
        : "animate-[abrirModal_0.2s_ease-out_forwards]"
    }
  `}
        >
          <div className="bg-white p-5 rounded-xl shadow-md">
            <p className="font-bold text-3xl">Editar perfil</p>

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
            <p className="font-bold text-3xl">Editar email</p>
            <p className="text-base">
              Caso queira editar o seu e-mail você tera que clicar no botão a
              baixo <br />e preencher os dados exigidos.
            </p>

            <div className="mt-3">
              <button className="cursor-pointer bg-gray-400 p-2 rounded-md text-lg text-white">
                Editar email
              </button>
            </div>
          </div>

          <br />

          <button
            onClick={fecharModal}
            className="cursor-pointer bg-gray-400 p-2 rounded-md text-lg text-white w-full"
          >
            Salvar
          </button>
        </dialog>

          <div className="p-3">           
            <p className="p-3">
              {" "}
              {/*Dá pra fazer um componente com esse p */}
              <b>Nome: </b>
              Luana Teixeira <br />
            </p>
            {/*Colocar o nome aqui com props */}
            <p className="p-3">
              <b>CRN:</b>
              00000-0
            </p>
            <p className="p-3">
              <b>Especialidade:</b>
              Clínica
            </p>
            <p className="p-3">
              <b>E-mail:</b>
              luana.teixeira@gmai.com
            </p>
            <p className="p-3">
              <b>Genero:</b>
              Feminino
            </p>
            <p className="p-3">
              <b>Data de Nascimento: </b>
              27/05/2000
            </p>
          </div>
        </main>
        <div className="flex items-center text-2xl font-bold mt-10">
          <UserRoundPen size={40} />
          <h2>AGENDAMENTOS</h2>
        </div>
        <Agendamentos />
      </div>
    </div>
  );
}

export default AdminHome;
