import { UserRoundPen } from "lucide-react";
import Agendamentos from "../components/Agendamentos";

function AdminHome() {
  return (
    <div className="flex">
      <div className="flex flex-col justify-center mb-90 ml-10 mt-10">
        <div className="ml-2 text-justify">
          <h1 className="text-6xl font-bold">Luana Teixeira</h1> <br />
          <p className="text-2xl font-bold">ID: 001</p> {/*Arrumar com props */}
        </div>
        <main className=" flex flex-col bg-gray-600 rounded-xl p-3 w-[60vw] h-full text-white text-3xl align-center justify-center text-justify">
          <div className="p-3">
            <p className="p-3">
              {" "}
              {/*Dá pra fazer um componente com esse p */}
              <b>Nome: </b>
              Luana Teixeira <br />
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

            <button className="bg-gray-400 flex w-fit p-2 text-2xl rounded-md text justify-center ml-3">
              Editar Perfil
            </button>
          </div>
        </main>
        <div className="flex items-center text-2xl font-bold mt-10">
          <UserRoundPen size={40} />
          <h2>PACIENTES</h2>
        </div>
        <Agendamentos />
      </div>
    </div>
  );
}

export default AdminHome;
