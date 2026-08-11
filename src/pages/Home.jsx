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
          <h1 className="text-green-950 text-[3vw] ml-4 my-auto font-bold">
            Alcance o equilíbrio, bem-estar e <br />
            resultados duradouros com <br />
            orientação nutricional <br />
            personalizada <br />
          </h1>
          <p className="text-green-950 text-[2vw] ml-4 my-auto">
            Protocolos personalizados para emagrecer com <br />
            saúde, corrigir deficiências e aumentar sua energia
          </p>
        </main>
        <img
          src="/img/LTfixed.png"
          alt=""
          className="w-[50%] h-[50%] max-w-xl mb-50px"
        />
      </HomeBackground>

      <HomeBackground>
        <section className="flex justify-center text-center">
          <img
            src="/img/lulu2.png"
            alt=""
            className="w-170 max-w-[680px] max-h-[680px]"
          />
          <div>
            <h1 className="text-green-950 text-[3vw] font-bold mb-10">
              CONHEÇA A NUTRICIONISTA
            </h1>
            <p className="text-green-950 font-light leading-18 text-[2vw] mb-5 text-justify mx-10">
              Sou a <b>Dra. Luana Teixeira, Nutricionista </b>em São Paulo,
              atendendo presencialmente e online em todo o Brasil. Especializada
              em Nutrição Clínica, tenho experiência em ambientes hospitalares e
              no acompanhamento de doenças crônicas e condições de saúde
              complexas. Dedico-me a oferecer um{" "}
              <b>atendimento individualizado, </b>
              com foco em transformar vidas e promover saúde e bem-estar.
            </p>
          </div>
        </section>
      </HomeBackground>
    </main>
  );
}

export default Home;
