{
  /*Chamando o home background para usa-lo como props. */
}
import HomeBackground from "../components/HomeBackground";

function Home() {
  return (
    <main>
      {/*Estamos basicamete chamando a prop de fundo que já tem o estilo pré-definido*/}
      <HomeBackground>
  <main className="w-full sm:w-[58%] my-auto">
    <div className="sm:ml-4 px-4 sm:px-0 text-left text-green-950 w-full">

      <h1 className="font-display text-3xl sm:text-4xl xl:text-5xl mb-5 font-semibold leading-tight tracking-normal">
        Alcance o equilíbrio, o bem-estar e resultados duradouros com atendimento nutricional{" "}
        <span className="font-display">100% online</span>{" "}

      </h1>

      <p className="font-delicate font-light text-lg sm:text-xl xl:text-2xl leading-relaxed tracking-normal mb-7">
        Protocolos individualizados para emagrecer com saúde,
        corrigir deficiências nutricionais e aumentar sua energia,
        com a praticidade de ser atendido de onde estiver.
      </p>

      <div className="flex flex-wrap justify-end gap-4 -mt-1 mr-1">
        <a
          href="/agendamento"
          className="inline-flex flex-col items-center justify-center rounded-full text-center
          bg-green-700 hover:bg-green-800 text-white font-sans font-semibold
          text-xs sm:text-xs uppercase tracking-[0.25em] px-13 py-5 shadow-md
          transition-colors duration-300"
        >
          Agende sua
          <br />
          consulta
        </a>
        <a
          href="#metodo"
          className="inline-flex flex-col items-center justify-center rounded-full border border-gray-400
          bg-[#f3eee6] hover:bg-[#eae3d8] text-green-950 font-sans font-semibold text-center
          text-xs sm:text-xs uppercase tracking-[0.2em] px-13 py-5
          transition-colors duration-300"
        >
          Conheça meu
          <br />
          método
        </a>
      </div>

    </div>
  </main>

  <img
    src="/img/LTfixed.png"
    alt="Nutricionista Luana Teixeira"
    className="hidden sm:block w-[42%] h-auto max-w-xl"
  />
</HomeBackground>

      <HomeBackground>
        <section id="metodo" className="flex justify-center text-center">
          <img
            src="/img/lulu2.png"
            alt=""
            className="hidden xl:block w-170 max-w-[680px] h-auto"
          />
          <div>
            <h1 className="text-green-950 text-[3vw] font-bold mb-10">
              CONHEÇA A NUTRICIONISTA
            </h1>
            <p className="text-green-950 font-light leading-10 sm:leading-18 sm:text-2xl xl:text-[2vw] mb-5 mx-10">
              Sou a <span className="font-extrabold">Dra. Luana Teixeira, Nutricionista </span> em São Paulo,
              atendendo presencialmente e online em todo o Brasil. Especializada
              em Nutrição Clínica, tenho experiência em ambientes hospitalares e
              no acompanhamento de doenças crônicas e condições de saúde
              complexas. Dedico-me a oferecer um{" "}
              <span className="font-extrabold">atendimento individualizado</span>,
              com foco em transformar vidas e promover saúde e bem-estar.
            </p>
          </div>
        </section>
      </HomeBackground>
    </main>
  );
}

export default Home;
