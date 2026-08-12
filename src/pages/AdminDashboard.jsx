import Sidebar from "../components/Sidebar";

function AdminDashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col justify-center mb-90 ml-10">
        <h1 className="text-7xl font-bold">Luana Teixeira</h1>
        <main className=" flex flex-col bg-gray-600 rounded-xl p-3 w-[60vw] h-full mr-10 text-white text-3xl align-center justify-center text-justify">
          <div className="p-3">
            <p className="p-3">
              {" "}
              {/*Dá pra fazer um componente com esse p */}
              <b>Nome: </b>
              Luana Teixeira
            </p>
            {/*Colocar o nome aqui com props */}
            <p className="p-3">
              <b>CRN:</b>
              00000-0
            </p>
            <p className="p-3">
              <b>Especialidade:</b>
              Clínica
            </p>
            <p className="p-3">
              <b>E-mail:</b>
              luana.teixeira@gmai.com
            </p>
            <p className="p-3">
              <b>Genero:</b>
              Feminino
            </p>
            <p className="p-3">
              <b>Data de Nascimento: </b>
              27/05/2000
            </p>

            <button className="bg-gray-400 flex w-[10vw] rounded-md text justify-center">
              Editar Perfil
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
