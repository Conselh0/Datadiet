function Agendamentos() {
  return (
    <div>
      <table className="border-2 w-full text-center border-separate rounded-md border-spacing-0 mt-10">
        <thead>
          <tr className="divide-x-3 divide-y-3">
            {" "}
            {/*divide-x-2 coloca a barra vertical na tabela */}
            {/*Onde fica os títulos */}
            <th className="border-1 border-black p-2 bg-gray-500 text-white">
              NÚMERO DO ATENDIMENTO
            </th>
            {/*Onde escrever os textos dos títulos */}
            <th className="border-1 border-black p-2 bg-gray-500 text-white">
              NOME DO PACIENTE
            </th>
            <th className="border-1 border-black p-2 bg-gray-500 text-white">
              DATA DO AGENDAMENTO
            </th>
            <th className="border-1 border-black p-2 bg-gray-500 text-white">
              STATUS
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border-1 border-black p-2">18</td>
            {/*Onde escrever os textos dos títulos */}
            <td className="border-1 border-black p-2">Maria Sousa</td>
            <td className="border-1 border-black p-2">20/06/2026 12:00</td>
            <td className="border-1 border-black p-2">
              <button className="bg-green-400 w-fit rounded-md p-1 m-2 px-3">
                Confirmado
              </button>{" "}
              {/*Aplicar o conceito de componente aqui*/}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Agendamentos;
