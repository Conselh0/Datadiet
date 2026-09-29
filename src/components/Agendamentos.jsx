function Agendamentos() {
  return (
    <div className="w-full overflow-x-auto shadow-xl">

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">

        <table className="w-full text-center border-collapse">

          {/* Cabeçalho */}
          <thead>

            <tr className="bg-gray-700 text-white">

              <th className="p-3 lg:p-4 text-xs md:text-sm font-semibold">
                NÚMERO DO ATENDIMENTO
              </th>

              <th className="p-3 lg:p-4 text-xs md:text-sm font-semibold">
                NOME DO PACIENTE
              </th>

              <th className="p-3 lg:p-4 text-xs md:text-sm font-semibold">
                DATA DO AGENDAMENTO
              </th>

              <th className="p-3 lg:p-4 text-xs md:text-sm font-semibold">
                STATUS
              </th>

            </tr>

          </thead>


          {/* Conteúdo */}
          <tbody>

            <tr
              className="
                border-b
                border-gray-200
                transition
                hover:bg-gray-100
              "
            >

              {/* Número */}
              <td className="p-3 lg:p-4 text-sm md:text-base text-gray-700 font-semibold">
                18
              </td>


              {/* Paciente */}
              <td className="p-3 lg:p-4 text-sm md:text-base text-gray-700">

                <div className="flex items-center justify-center gap-2">

                  <div
                    className="
                      w-8
                      h-8
                      rounded-full
                      bg-gray-300
                      flex
                      items-center
                      justify-center
                      text-gray-700
                      font-bold
                    "
                  >
                    MS
                  </div>

                  <span>
                    Maria Sousa
                  </span>

                </div>

              </td>


              {/* Data */}
              <td className="p-3 lg:p-4 text-sm md:text-base text-gray-600">

                <div className="flex flex-col">

                  <span className="font-semibold text-gray-700">
                    20/06/2026
                  </span>

                  <span className="text-gray-500 text-sm">
                    12:00
                  </span>

                </div>

              </td>


              {/* Status */}
              <td className="p-3 lg:p-4">

                <span
                  className="
                    inline-flex
                    items-center
                    gap-2
                    bg-green-100
                    text-green-700
                    font-semibold
                    text-xs
                    md:text-sm
                    px-3
                    py-2
                    rounded-full
                  "
                >

                  <span className="w-2 h-2 rounded-full bg-green-500" />

                  Confirmado

                </span>

              </td>

            </tr>


            {/* Exemplo de outra linha */}
            <tr
              className="
                border-b
                border-gray-200
                transition
                hover:bg-gray-100
              "
            >

              <td className="p-3 lg:p-4 text-sm md:text-base text-gray-700 font-semibold">
                19
              </td>


              <td className="p-3 lg:p-4 text-sm md:text-base text-gray-700">

                <div className="flex items-center justify-center gap-2">

                  <div
                    className="
                      w-8
                      h-8
                      rounded-full
                      bg-gray-300
                      flex
                      items-center
                      justify-center
                      text-gray-700
                      font-bold
                    "
                  >
                    JS
                  </div>

                  <span>
                    João Silva
                  </span>

                </div>

              </td>


              <td className="p-3 lg:p-4 text-sm md:text-base text-gray-600">

                <div className="flex flex-col">

                  <span className="font-semibold text-gray-700">
                    21/06/2026
                  </span>

                  <span className="text-gray-500 text-sm">
                    14:30
                  </span>

                </div>

              </td>


              <td className="p-3 lg:p-4">

                <span
                  className="
                    inline-flex
                    items-center
                    gap-2
                    bg-yellow-100
                    text-yellow-700
                    font-semibold
                    text-xs
                    md:text-sm
                    px-3
                    py-2
                    rounded-full
                  "
                >

                  <span className="w-2 h-2 rounded-full bg-yellow-500" />

                  Pendente

                </span>

              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Agendamentos;
