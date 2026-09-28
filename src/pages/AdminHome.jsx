import {Settings } from "lucide-react";

import Agendamentos from "../components/Agendamentos";

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
    <div className="w-full min-h-screen bg-gray-100">

      <div className="w-full p-4 lg:p-10">

        {/* Cabeçalho */}
        <div className="max-w-5xl mb-8">

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">

            <div>

              <h1 className="text-4xl lg:text-5xl font-bold text-gray-800">
                Luana Teixeira
              </h1>

              <p className="text-gray-500 text-lg mt-1">
                ID: 001
              </p>

            </div>

          </div>

        </div>


        {/* =========================
            CARD DO PERFIL
        ========================= */}

        <main
          className="
            relative
            w-full
            max-w-5xl
            shadow-xl/20
            bg-gray-500
            rounded-3xl
            p-6
            lg:p-8
            text-white
            overflow-hidden
            mb-10
          "
        >

          {/* Decorações */}
          <div
            className="
              absolute
              -right-16
              -top-16
              w-40
              h-40
              rounded-full
              bg-gray-600/50
              pointer-events-none
            "
          />

          <div
            className="
              absolute
              -right-10
              -bottom-24
              w-52
              h-52
              rounded-full
              bg-gray-600/30
              pointer-events-none
            "
          />


          {/* Botão editar */}
          <button className="absolute top-4 right-4" onClick={abrirModal}>

          <Settings className="cursor-pointer size-13 p-1.5 bg-gray-500 rounded-2xl" />

        </button>


          {/* =========================
              DIALOG
          ========================= */}

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

              <p className="font-bold text-3xl">
                Editar perfil
              </p>

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

                <option value="Clinica e Hospitalar">
                  Homem
                </option>

                <option value="Esportiva">
                  Mulher
                </option>

                <option value="Materno-Infantil">
                  Prefiro não responder
                </option>

                <option value="Comportamental e Emagrecimento">
                  Outro
                </option>

              </select>

            </div>

            <br />

            <div className="bg-white p-5 rounded-xl shadow-md">

              <p className="font-bold text-3xl">
                Editar email
              </p>

              <p className="text-base">
                Caso queira editar o seu e-mail você tera que clicar no botão a
                baixo <br />
                e preencher os dados exigidos.
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


          {/* =========================
              INFORMAÇÕES
          ========================= */}

          <div className="relative z-10">

            {/* Título do card */}
            <div className="flex items-center gap-3 mb-6">

              <div>

                <h2 className="text-2xl font-bold">
                  Dados da nutricionista
                </h2>

              </div>

            </div>


            {/* Informações */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Nome */}
              <div
                className="
                  bg-gray-600/70
                  rounded-2xl
                  p-4
                  transition
                  hover:bg-gray-600
                "
              >

                <p className="text-sm text-gray-300">
                  Nome completo
                </p>

                <p className="text-xl font-semibold mt-1">
                  Luana Teixeira
                </p>

              </div>


              {/* CRN */}
              <div
                className="
                  bg-gray-600/70
                  rounded-2xl
                  p-4
                  transition
                  hover:bg-gray-600
                "
              >

                <p className="text-sm text-gray-300">
                  CRN
                </p>

                <p className="text-xl font-semibold mt-1">
                  00000-0
                </p>

              </div>


              {/* Especialidade */}
              <div
                className="
                  bg-gray-600/70
                  rounded-2xl
                  p-4
                  transition
                  hover:bg-gray-600
                "
              >

                <p className="text-sm text-gray-300">
                  Especialidade
                </p>

                <p className="text-xl font-semibold mt-1">
                  Clínica
                </p>

              </div>


              {/* E-mail */}
              <div
                className="
                  bg-gray-600/70
                  rounded-2xl
                  p-4
                  transition
                  hover:bg-gray-600
                "
              >

                <p className="text-sm text-gray-300">
                  E-mail
                </p>

                <p className="text-xl font-semibold mt-1 break-all">
                  luana.teixeira@gmai.com
                </p>

              </div>


              {/* Gênero */}
              <div
                className="
                  bg-gray-600/70
                  rounded-2xl
                  p-4
                  transition
                  hover:bg-gray-600
                "
              >

                <p className="text-sm text-gray-300">
                  Gênero
                </p>

                <p className="text-xl font-semibold mt-1">
                  Feminino
                </p>

              </div>


              {/* Data de nascimento */}
              <div
                className="
                  bg-gray-600/70
                  rounded-2xl
                  p-4
                  transition
                  hover:bg-gray-600
                "
              >

                <p className="text-sm text-gray-300">
                  Data de nascimento
                </p>

                <p className="text-xl font-semibold mt-1">
                  27/05/2000
                </p>

              </div>

            </div>

          </div>

        </main>


        {/* =========================
            AGENDAMENTOS
        ========================= */}

        <div className="max-w-5xl">

          <div className="flex items-center gap-3 mb-5">

            <div>

              <h2 className="text-gray-800 text-3xl lg:text-4xl font-bold">
                Agendamentos
              </h2>

            </div>

          </div>


          <Agendamentos />

        </div>

      </div>

    </div>
  );
}

export default AdminHome;