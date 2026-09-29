import { useState } from "react";

import ModalPaciente from "../components/ModalPaciente";

function Pacientes() {
  // Paciente selecionado
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);

  // Futuramente virão do banco
  const pacientes = [
    {
      id: 18,
      nome: "Maria Sousa",
      nascimento: "15/03/1998",
      email: "maria@email.com",
      telefone: "(11) 99999-1111",
      data: "20/06/2026",
      hora: "12:00",
    },

    {
      id: 19,
      nome: "João Silva",
      nascimento: "08/10/2000",
      email: "joao@email.com",
      telefone: "(11) 98888-2222",
      data: "21/06/2026",
      hora: "14:30",
    },

    {
      id: 20,
      nome: "Ana Oliveira",
      nascimento: "22/01/1995",
      email: "ana@email.com",
      telefone: "(11) 97777-3333",
      data: "25/06/2026",
      hora: "09:00",
    },
  ];

  // Abre o paciente selecionado
  function abrirPaciente(paciente) {
    setPacienteSelecionado(paciente);
  }

  // Pega as iniciais
  function iniciais(nome) {
    return nome
      .split(" ")
      .map((parte) => parte[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="w-full p-4 lg:p-10">
        {/* =========================
            CABEÇALHO
        ========================= */}

        <div className="max-w-5xl mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800">
            Pacientes
          </h1>
        </div>

        {/* =========================
            BUSCA + CADASTRO
        ========================= */}

        <div className="max-w-5xl mb-6">
          <div
            className="
              bg-gray-500
              rounded-3xl
              p-5
              lg:p-6
              shadow-xl/20
            "
          >
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              {/* Pesquisa */}

              <div className="flex-1">
                <label
                  htmlFor="buscarPaciente"
                  className="text-white font-semibold block mb-2"
                >
                  Buscar paciente
                </label>

                <input
                  id="buscarPaciente"
                  type="search"
                  placeholder="Digite o ID ou nome do paciente"
                  className="
                    w-full
                    h-11
                    px-4
                    bg-gray-100
                    rounded-xl
                    shadow-md
                    outline-none
                    text-gray-700
                    focus:ring-2
                    focus:ring-gray-300
                  "
                />
              </div>

              {/* Botão */}

              <button
                className="
                  cursor-pointer
                  bg-gray-700
                  hover:bg-gray-800
                  text-white
                  font-semibold
                  px-5
                  h-11
                  rounded-xl
                  transition
                  active:scale-95
                  whitespace-nowrap
                "
              >
                + Cadastrar novo paciente
              </button>
            </div>
          </div>
        </div>

        {/* =========================
            TABELA
        ========================= */}

        <div className="max-w-5xl">
          <div
            className="
      bg-white
      rounded-3xl
      shadow-xl/20
      overflow-hidden
    "
          >
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="bg-gray-500 text-white">
                  <th className="p-4 font-semibold">ID</th>

                  <th className="p-4 font-semibold">PACIENTE</th>

                  <th className="p-4 font-semibold">ÚLTIMA CONSULTA</th>
                </tr>
              </thead>

              <tbody>
                {pacientes.map((paciente) => (
                  <tr
                    key={paciente.id}
                    onClick={() => abrirPaciente(paciente)}
                    className="
              border-b
              border-gray-200
              cursor-pointer
              transition
              hover:bg-gray-100
            "
                  >
                    <td
                      className="
                p-4
                text-gray-700
                font-semibold
              "
                    >
                      #{paciente.id}
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-3 w-64 mx-auto text-left">
                        <div
                          className="
                    w-10
                    h-10
                    rounded-full
                    bg-gray-500
                    text-white
                    flex
                    items-center
                    justify-center
                    font-bold
                  "
                        >
                          {iniciais(paciente.nome)}
                        </div>

                        <span className="font-semibold text-gray-700">
                          {paciente.nome}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-700">
                          {paciente.data}
                        </span>

                        <span className="text-gray-400">{paciente.hora}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* =========================
            MODAL
        ========================= */}

        <ModalPaciente
          paciente={pacienteSelecionado}
          aberto={pacienteSelecionado !== null}
          fechar={() => setPacienteSelecionado(null)}
        />

        <p className="text-gray-500 text-lg mt-5 ml-1">
          Clique no paciente para ver mais informações.
        </p>
      </div>
    </div>
  );
}

export default Pacientes;
