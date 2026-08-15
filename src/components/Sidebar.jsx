import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="min-h-screen w-70 bg-gray-500">
      <img
        src="/img/luana.png"
        alt=""
        className="rounded-[300px] border-2 w-50 m-auto"
      />
      <p className="text-white text-center text-4xl font-bold">
        Luana Teixeira <br />
      </p>
      <p className="text-white text-center">
        ID: 001 {/*Colocar com props o id dinâmico aqui */}
      </p>

      <section className="flex flex-col text-center mt-10 text-white bg-gray-400 font-bold">
        <Link
          to="/Admin"
          className="p-10 hover:bg-gray-600 transition-colors duration-200"
        >
          PERFIL
        </Link>
        <Link
          to="/Admin/Historico"
          className="p-10 hover:bg-gray-600 transition-colors duration-200"
        >
          HISTÓRICO DE CONSULTAS
        </Link>
        <Link
          to="/Admin/Agendamentos"
          className="p-10 hover:bg-gray-600 transition-colors duration-200"
        >
          AGENDAMENTOS
        </Link>
        <Link
          to="#"
          className="p-10 hover:bg-gray-600 transition-colors duration-200"
        >
          CADASTRO NUTRI
        </Link>
      </section>
    </div>
  );
}

export default Sidebar;
