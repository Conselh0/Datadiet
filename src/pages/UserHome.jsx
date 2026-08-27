import DataAgendamentos from "../components/DataAgendamentos";

function UserHome() {
  return (
    <main className="w-full p-4 lg:p-10 min-h-screen flex flex-col lg:block items-center">
      <div className="text-green-950 font-bold text-center lg:text-start">
        <h1 className="text-5xl ">Ana Clara</h1>
        <p className="text-2xl">ID: 0001</p>
      </div>
      <div className="bg-green-950 text-white w-full lg:w-[60vw] p-4 min-h-96 rounded-xl text-xl lg:text-3xl flex flex-col justify-between mb-10">
        <div>
          <p className="p-3">
            <b>Nome:</b> Ana Clara
          </p>
          <p className="p-3">
            <b>Data</b> de Nascimento: 20/01/2000
          </p>
          <p className="p-3">
            <b>E-mail:</b> ana@hotmail.com
          </p>
          <p className="p-3">
            <b>Gênero:</b> Feminino
          </p>
        </div>
        <div>
          <button className="cursor-pointer bg-green-700 p-2 rounded-md">
            Editar perfil
          </button>
        </div>
      </div>
      <DataAgendamentos />
    </main>
  );
}

export default UserHome;
