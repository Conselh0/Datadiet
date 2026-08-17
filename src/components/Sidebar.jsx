import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-screen lg:w-fit lg:min-h-screen lg:w-70 bg-gray-500">
      <img
        src="/img/luana.png"
        alt=""
        className="rounded-[300px] border-2 w-30 lg:w-50 m-auto"
      />
      <p className="hidden lg:block lg:text-white lg:text-center lg:text-4xl lg:font-bold">
        Luana Teixeira <br />
      </p>
      <p className="hidden lg:block lg:text-white lg:text-center">
        ID: 001 {/*Colocar com props o id dinâmico aqui */}
      </p>

      <section className="flex lg:flex-col lg:text-center lg:mt-10 text-white bg-gray-400 font-bold">
        <Link
          to="/Admin"
          className="flex items-center w-full justify-center text-center md:text-[50%] lg:text-[1vw] p-5 lg:p-10 hover:bg-gray-600 transition-colors duration-200"
        >
          PERFIL
        </Link>
        <Link
          to="/Admin/Historico"
          className="flex items-center w-full justify-center text-center md:text-[50%] lg:text-[1vw] p-5 lg:p-10 hover:bg-gray-600 transition-colors duration-200"
        >
          HISTÓRICO DE CONSULTAS
        </Link>
        <Link
          to="/Admin/Agendamentos"
          className="flex items-center w-full justify-center text-center md:text-[50%] lg:text-[1vw] p-5 lg:p-10 hover:bg-gray-600 transition-colors duration-200"
        >
          AGENDAMENTOS
        </Link>
        <Link
          to="#"
          className="flex items-center w-full justify-center text-center md:text-[50%] lg:text-[1vw] p-5 lg:p-10 hover:bg-gray-600 transition-colors duration-200"
        >
          CADASTRO NUTRI
        </Link>
      </section>
    </div>
  );
}

export default Sidebar;
