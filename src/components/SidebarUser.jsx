import { Link } from "react-router-dom";

function SidebarUser() {
  return (
    <div className="bg-green-900 flex flex-col min-h-screen min-w-75 items-center">
      <div className="p-5">
        <img
          src="/img/mulher.jpg"
          alt=""
          className="rounded-[300px] border-2 w-50 lg:w-50 m-auto"
        />
        <p className="block text-white text-center text-4xl font-bold">
          Ana Clara <br />
        </p>
        <p className="block text-white text-center">
          ID: 0001 {/*Colocar com props o id dinâmico aqui */}
        </p>
      </div>

      <section className="flex flex-col text-center text-white bg-green-950 w-full font-bold mt-30">
        <Link className="hover:bg-green-700 p-8">PERFIL</Link>
        <Link to="/User/Historico" className="hover:bg-green-700 p-8">
          HISTÓRICO DE CONSULTAS
        </Link>
        <Link to="/User/Agendamentos" className="hover:bg-green-700 p-8">
          AGENDAR
        </Link>
        <Link to="/" className="hover:bg-green-700 p-8">
          SAIR
        </Link>
      </section>
    </div>
  );
}

export default SidebarUser;
