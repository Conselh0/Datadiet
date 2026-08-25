import { Link } from "react-router-dom";

function SidebarUser() {
  return (
    <div className="bg-green-900 flex flex-col h-screen w-80 items-center justify-between">
      <div>
        <img
          src="/img/mulher.jpg"
          alt=""
          className="w-40 rounded-[300px] border-1"
        />
        <p className="block text-white text-center text-4xl font-bold">
          Ana Clara <br />
        </p>
        <p className="block text-white text-center">
          ID: 0001 {/*Colocar com props o id dinâmico aqui */}
        </p>
      </div>

      <section className="flex flex-col text-center text-white bg-green-950 w-full h-fit font-bold">
        <Link className="hover:bg-green-700 p-8">PERFIL</Link>
        <Link className="hover:bg-green-700 p-8">AGENDAMENTOS</Link>
        <Link className="hover:bg-green-700 p-8">CONSULTAS</Link>
        <Link className="hover:bg-green-700 p-8">AGENDAR CONSULTA</Link>
        <Link to="/" className="hover:bg-green-700 p-8">
          SAIR
        </Link>
      </section>
    </div>
  );
}

export default SidebarUser;
