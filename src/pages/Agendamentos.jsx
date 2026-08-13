function Agendamentos() {
  return (
    <div>
      <table className="border-2 w-full text-center rounded-3xl">
        <tr className="border-2 divide-x-2">
          {" "}
          {/*divide-x-2 coloca a barra vertical na tabela */}
          {/*Onde fica os títulos */}
          <th>NÚMERO DO ATENDIMENTO</th>
          {/*Onde escrever os textos dos títulos */}
          <th>NOME DO PACIENTE</th>
          <th>DATA DO AGENDAMENTO</th>
          <th>STATUS</th>
        </tr>
        <tr>
          {/*Onde fica os títulos */}
          <td>18</td>
          {/*Onde escrever os textos dos títulos */}
          <td>Maria Sousa</td>
          <td>20/06/2026 12:00</td>
          <td>
            <button>Confirmado</button>
          </td>
        </tr>
      </table>
    </div>
  );
}

export default Agendamentos;
