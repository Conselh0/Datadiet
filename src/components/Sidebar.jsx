import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="h-[100vh] w-70 bg-gray-500">
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
          to="#"
          className="p-10"
          onMouseEnter={(e) => (e.target.style.backgroundColor = "gray")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "")}
        >
          PERFIL
        </Link>
        <Link
          to="#"
          className="p-10"
          onMouseEnter={(e) => (e.target.style.backgroundColor = "gray")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "")}
        >
          HISTÓRICO DE CONSULTAS
        </Link>
        <Link
          to="#"
          className="p-10"
          onMouseEnter={(e) => (e.target.style.backgroundColor = "gray")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "")}
        >
          PACIENTE
        </Link>
        <Link
          to="#"
          className="p-10"
          onMouseEnter={(e) => (e.target.style.backgroundColor = "gray")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "")}
        >
          AGENDAMENTOsS
        </Link>
        <Link
          to="#"
          className="p-10"
          onMouseEnter={(e) => (e.target.style.backgroundColor = "gray")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "")}
        >
          CADASTRO NUTRI
        </Link>
      </section>
    </div>
  );
}

export default Sidebar;
