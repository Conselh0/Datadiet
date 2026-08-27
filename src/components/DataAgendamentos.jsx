function DataAgendamentos() {
  return (
    <div className="bg-green-950 w-[60vw] h-[45vh] p-3 text-center rounded-xl">
      <h1 className="bg-white rounded-md font-bold text-3xl p-2">
        AGENDAMENTOS
      </h1>
      <div className="text-white">
        <p className="text-2xl font-bold">
          A sua consulta está agendada para o seguinte dia e horário:
        </p>
        <div className="m-5">
          <h2 className="font-bold text-5xl">Dia</h2>
          <p className="text-4xl">--/--/----</p>
        </div>
        <div className="m-5 mt-20">
          <h2 className="font-bold text-5xl">Horário</h2>
          <p className="text-4xl">--:--</p>
        </div>
      </div>
    </div>
  );
}

export default DataAgendamentos;
