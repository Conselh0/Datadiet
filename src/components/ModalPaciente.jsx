import { useEffect, useRef, useState } from "react";

function ModalPaciente({ paciente, aberto, fechar }) {
  const modal = useRef();
  const [fechando, setFechando] = useState(false);

  // Abre o modal quando um paciente é selecionado
  useEffect(() => {
    if (aberto) {
      modal.current?.showModal();
    }
  }, [aberto]);

  // Fecha o modal com animação
  function fecharModal() {
    setFechando(true);

    setTimeout(() => {
      modal.current.close();
      setFechando(false);

      fechar();
    }, 300);
  }

  // Pega as iniciais do nome
  function iniciais(nome) {
    return nome
      .split(" ")
      .map((parte) => parte[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  return (
    <dialog
      ref={modal}
      className={`
        rounded-3xl
        bg-transparent
        p-0
        fixed
        top-1/2
        left-1/2
        -translate-x-1/2
        -translate-y-1/2
        backdrop:bg-black/50
        backdrop:backdrop-blur-sm

        ${
          fechando
            ? "animate-[fecharModal_0.2s_ease-in_forwards]"
            : "animate-[abrirModal_0.2s_ease-out_forwards]"
        }
      `}
    >
      {paciente && (
        <div className="w-[90vw] max-w-2xl">
          {/* =========================
              CABEÇALHO
          ========================= */}

          <div
            className="
              bg-gray-500
              rounded-t-3xl
              p-6
              text-white
              relative
              overflow-hidden
            "
          >
            {/* Decoração */}

            <div
              className="
                absolute
                -right-10
                -top-10
                w-32
                h-32
                rounded-full
                bg-gray-600/50
              "
            />

            <div className="relative z-10 flex items-center gap-4">
              {/* Avatar */}

              <div
                className="
                  w-16
                  h-16
                  rounded-2xl
                  bg-gray-600
                  flex
                  items-center
                  justify-center
                  text-xl
                  font-bold
                "
              >
                {iniciais(paciente.nome)}
              </div>

              {/* Nome */}

              <div>
                <p className="text-gray-300 text-sm">Paciente</p>

                <h2 className="text-2xl font-bold">{paciente.nome}</h2>

                <p className="text-gray-300">ID: {paciente.id}</p>
              </div>
              <button className="cursor-pointer bg-gray-600 hover:bg-gray-700 p-3 rounded-xl text-lg text-white w-70 font-semibold transition ml-25">
              Acessar Ficha de anamnese
            </button>
            </div>
            
          </div>

          {/* =========================
              INFORMAÇÕES
          ========================= */}

          <div className="bg-gray-100 p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-5">
              Informações do paciente
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nome */}

              <div
                className="
                  bg-white
                  rounded-2xl
                  p-4
                  shadow-sm
                  transition
                  hover:shadow-md
                "
              >
                <p className="text-sm text-gray-400">Nome completo</p>

                <p className="text-lg font-semibold text-gray-700 mt-1">
                  {paciente.nome}
                </p>
              </div>

              {/* ID */}

              <div
                className="
                  bg-white
                  rounded-2xl
                  p-4
                  shadow-sm
                  transition
                  hover:shadow-md
                "
              >
                <p className="text-sm text-gray-400">ID do paciente</p>

                <p className="text-lg font-semibold text-gray-700 mt-1">
                  #{paciente.id}
                </p>
              </div>

              {/* Data nascimento */}

              <div
                className="
                  bg-white
                  rounded-2xl
                  p-4
                  shadow-sm
                  transition
                  hover:shadow-md
                "
              >
                <p className="text-sm text-gray-400">Data de nascimento</p>

                <p className="text-lg font-semibold text-gray-700 mt-1">
                  {paciente.nascimento}
                </p>
              </div>

              {/* Telefone */}

              <div
                className="
                  bg-white
                  rounded-2xl
                  p-4
                  shadow-sm
                  transition
                  hover:shadow-md
                "
              >
                <p className="text-sm text-gray-400">Telefone</p>

                <p className="text-lg font-semibold text-gray-700 mt-1">
                  {paciente.telefone}
                </p>
              </div>

              {/* Email */}

              <div
                className="
                  bg-white
                  rounded-2xl
                  p-4
                  shadow-sm
                  transition
                  hover:shadow-md
                  md:col-span-2
                "
              >
                <p className="text-sm text-gray-400">E-mail</p>

                <p className="text-lg font-semibold text-gray-700 mt-1 break-all">
                  {paciente.email}
                </p>
              </div>
            </div>

            {/* Última consulta */}

            <div
              className="
                mt-5
                bg-white
                rounded-2xl
                p-4
                shadow-sm
              "
            >
              <p className="text-sm text-gray-400">Última consulta</p>

              <p className="text-lg font-semibold text-gray-700 mt-1">
                {paciente.data} às {paciente.hora}
              </p>
            </div>
            

            

            
            <br />

            <button className="cursor-pointer bg-green-700 hover:bg-green-600 p-3 rounded-xl text-lg text-white w-50 font-semibold transition mt-5">
              Editar perfil
            </button>

            <button className="cursor-pointer bg-red-700 hover:bg-red-600 p-3 rounded-xl text-lg text-white w-50 font-semibold transition mt-5 ml-5">
              Excluir perfil
            </button>

          </div>

          {/* =========================
              RODAPÉ
          ========================= */}

          <div
            className="
              bg-gray-100
              px-6
              pb-6
              rounded-b-3xl
            "
          >
            <button
              onClick={fecharModal}
              className="
                cursor-pointer
                bg-gray-500
                hover:bg-gray-600
                p-3
                rounded-xl
                text-lg
                text-white
                w-full
                font-semibold
                transition
              "
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}

export default ModalPaciente;
