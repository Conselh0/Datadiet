import { Link } from "react-router-dom";
import { useState } from "react";
import { List } from "lucide-react";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-row relative lg:flex-col lg:w-fit lg:min-h-screen lg:w-70 bg-gray-500">
      <img
        src="/img/luana.png"
        alt=""
        className="rounded-[300px] border-2 w-20 lg:w-50 m-auto"
      />
      <p className="hidden lg:block lg:text-white lg:text-center lg:text-4xl lg:font-bold">
        Luana Teixeira <br />
      </p>
      <p className="hidden lg:block lg:text-white lg:text-center">
        ID: 001 {/*Colocar com props o id dinâmico aqui */}
      </p>
      {/*O que faz o interruptor do useState funcionar */}
      <button className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
        <List className="cursor-pointer" color="white" size={40} />
      </button>

      {/*O que vai linkar o button com os links*/}
      <section
        className={`${isOpen ? "block" : "hidden"} flex-col lg:flex lg:flex-col text-center lg:mt-4 mt-20 absolute lg:relative lg:mt-5  text-white bg-gray-400 font-bold w-full`}
      >
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

        <Link
          to="/"
          className="flex items-center w-full justify-center text-center md:text-[50%] lg:text-[1vw] p-5 lg:p-10 hover:bg-gray-600 transition-colors duration-200"
        >
          SAIR
        </Link>
      </section>
    </div>
  );
}

export default Sidebar;
