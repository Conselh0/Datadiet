import DataAgendamentos from "../components/DataAgendamentos";

import { Settings } from "lucide-react";

import { useRef, useState } from "react";

import "../index.css";

function UserHome() {
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
    <main className="w-full min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 p-4 lg:p-10">
      {/* Cabeçalho do perfil */}
      <div className="max-w-5xl mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-green-950">
              Ana Clara
            </h1>

            <p className="text-green-800/70 text-lg mt-1">ID: 0001</p>
          </div>
        </div>
      </div>

      {/* Card com informações do paciente */}
      <div
        className="
          bg-green-950
          text-white
          w-full
          max-w-5xl
          p-6
          lg:p-8
          rounded-3xl
          shadow-xl/30
          mb-8
          relative
          overflow-hidden
        "
      >
        {/* Detalhe decorativo */}
        <div className="absolute -right-16 -top-16 w-40 h-40 rounded-full bg-green-800/40" />
        <div className="absolute -right-8 -bottom-20 w-48 h-48 rounded-full bg-green-800/20" />

        {/* Botão editar */}
        <button className="absolute top-4 right-4 z-20" onClick={abrirModal}>
          <Settings className="cursor-pointer size-13 p-1.5 bg-green-700 rounded-2xl" />
        </button>

        <dialog
          ref={modal}
          className={`rounded-xl bg-taupe-50/90 h-152 w-150 p-5 fixed top-1/2 left-1/2
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
              <button className="cursor-pointer bg-green-700 p-2 rounded-md text-lg text-white">
                Editar email
              </button>
            </div>
          </div>

          <br />

          <button
            onClick={fecharModal}
            className="cursor-pointer bg-green-700 p-2 rounded-md text-lg text-white w-full"
          >
            Salvar
          </button>
        </dialog>

        {/* Conteúdo do perfil */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">

            <div>
              <h2 className="text-2xl font-bold">Dados do paciente</h2>
            </div>
          </div>

          {/* Informações */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-900/60 rounded-2xl p-4">
              <p className="text-sm text-green-200">Nome completo</p>

              <p className="text-xl font-semibold mt-1">Ana Clara</p>
            </div>

            <div className="bg-green-900/60 rounded-2xl p-4">
              <p className="text-sm text-green-200">Data de nascimento</p>

              <p className="text-xl font-semibold mt-1">20/01/2000</p>
            </div>

            <div className="bg-green-900/60 rounded-2xl p-4">
              <p className="text-sm text-green-200">E-mail</p>

              <p className="text-xl font-semibold mt-1 break-all">
                ana@hotmail.com
              </p>
            </div>

            <div className="bg-green-900/60 rounded-2xl p-4">
              <p className="text-sm text-green-200">Gênero</p>

              <p className="text-xl font-semibold mt-1">Feminino</p>
            </div>
          </div>
        </div>
      </div>

      {/* Próximo agendamento */}
      <DataAgendamentos />
    </main>
  );
}

export default UserHome;
