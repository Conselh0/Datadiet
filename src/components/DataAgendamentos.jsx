function DataAgendamentos() {
  return (
    <div className=" bg-green-950/96 w-full max-w-5xl p-5 lg:p-7 rounded-3xl shadow-xl/30 text-center overflow-hidden ">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-left">
          <h1 className="text-white text-2xl font-bold">
            Sua proxíma consulta
          </h1>
        </div>
      </div>
      {/* Informação principal */}
      <div className=" bg-white rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-5 items-center ">
        {/* Data */}
        <div className="bg-green-50 rounded-2xl p-5">
          <p className="text-green-700 font-semibold text-sm uppercase">Data</p>
          <h2 className="text-green-950 font-bold text-4xl mt-2">--/--/----</h2>
        </div>
        {/* Horário */}
        <div className="bg-green-50 rounded-2xl p-5">
          <p className="text-green-700 font-semibold text-sm uppercase">
            Horário
          </p>
          <h2 className="text-green-950 font-bold text-4xl mt-2">--:--</h2>
        </div>
      </div>
      {/* Mensagem */}
      <p className="text-green-200 text-sm mt-5">
        Acompanhe aqui os detalhes da sua próxima consulta.
      </p>
    </div>
  );
}
export default DataAgendamentos;
