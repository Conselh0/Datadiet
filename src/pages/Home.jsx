{
  /*Chamando o home background para usa-lo como props. */
}
import HomeBackground from "../components/HomeBackground";

function Home() {
  return (
    <main>
      {/*Estamos basicamete chamando a prop de fundo que já tem o estilo pré-definido*/}
      <HomeBackground>
        <main className="w-[60%] my-auto">
          <div className="sm:ml-4 text-green-950 w-full">
            <h1 className="text-4xl mb-4 sm:mb-0 sm:text-[3vw] my-auto font-bold">
              Alcance o equilíbrio, bem-estar e <br />
              resultados duradouros com <br />
              orientação nutricional <br />
              personalizada <br />
            </h1>
            <p className="text-2xl sm:text-[2vw]">
              Protocolos personalizados para emagrecer com
              <br />
              saúde, corrigir deficiências e aumentar sua energia
            </p>
          </div>
        </main>
        <img
          src="/img/LTfixed.png"
          alt=""
          className="hidden sm:block w-[50%] h-[50%] max-w-xl mb-50px"
        />
      </HomeBackground>

      <HomeBackground>
        <section className="flex justify-center text-center">
          <img
            src="/img/lulu2.png"
            alt=""
            className="hidden xl:block w-170 max-w-[680px] h-auto"
          />
          <div>
            <h1 className="text-green-950 text-[3vw] font-bold mb-10">
              CONHEÇA A NUTRICIONISTA
            </h1>
            <p className="text-green-950 font-light leading-10  sm:leading-18 sm:text-2xl xl:text-[2vw] mb-5 text-justify mx-10">
              Sou a{" "}
              <span className="font-extrabold">
                Dra. Luana Teixeira, Nutricionista{" "}
              </span>{" "}
              em São Paulo, atendendo presencialmente e online em todo o Brasil.
              Especializada em Nutrição Clínica, tenho experiência em ambientes
              hospitalares e no acompanhamento de doenças crônicas e condições
              de saúde complexas. Dedico-me a oferecer um{" "}
              <span className="font-extrabold">
                atendimento individualizado
              </span>
              , com foco em transformar vidas e promover saúde e bem-estar.
            </p>
          </div>
        </section>
      </HomeBackground>
    </main>
  );
}

export default Home;
