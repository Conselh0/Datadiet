function HistoricoConsultas() {
  return (
    <div className="flex items-center">
      <table className="border-2 col-span-3 w-full lg:w-[75vw] text-center border-separate rounded-md border-spacing-0">
        <thead>
          <tr className="divide-x-3 divide-y-3 w-1/4">
            {" "}
            {/*divide-x-2 coloca a barra vertical na tabela */}
            {/*Onde fica os títulos */}
            <th className="border-1 border-black p-0 lg:p-2 w-1/4 text-xs md:text-base bg-green-900 text-white">
              PROTOCOLO
            </th>
            {/*Onde escrever os textos dos títulos */}
            <th className="border-1 border-black p-0 lg:p-2 w-1/4 text-xs md:text-base bg-green-900 text-white">
              PROFISSIONAL
            </th>
            <th className="border-1 border-black p-0 lg:p-2 w-1/4 text-xs md:text-base bg-green-900 text-white">
              DATA/HORA
            </th>
            <th className="border-1 border-black p-0 lg:p-2 w-1/4 text-xs md:text-base bg-green-900 text-white">
              STATUS
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border-1 border-black p-0 lg:p-2 text-xs md:text-base">
              18
            </td>
            {/*Onde escrever os textos dos títulos */}
            <td className="border-1 border-black p-0 lg:p-2 text-xs md:text-base">
              Maria Sousa
            </td>
            <td className="border-1 border-black p-0 lg:p-2 text-xs md:text-base">
              20/06/2026 | 12:00
            </td>
            <td className="border-1 border-black  p-0 lg:p-2 text-xs md:text-base">
              <button className="bg-green-400 w-fit rounded-md p-0 md:p-2 m-2 md:px-3">
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

export default HistoricoConsultas;
