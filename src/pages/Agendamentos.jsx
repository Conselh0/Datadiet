import Cards from "../components/Cards";

function Agendamentos() {
  return (
    <div className="bg-[url('/img/bolas.png')] w-screen h-screen bg-green-400/20  flex flex-col justify-center items-center text-center">
      <h1 className="text-6xl text-green-700 mb-30">
        ESCOLHA SEU NUTRICIONISTA
      </h1>
      <div className="flex">
        <Cards />
      </div>
    </div>
  );
}

export default Agendamentos;
