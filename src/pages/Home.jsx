{
  /*Chamando o home background para usa-lo como props. */
}
import HomeBackground from "../components/HomeBackground";
import {
  Activity,
  ArrowRight,
  Brain,
  Droplets,
  HeartPulse,
  Ribbon,
  Stethoscope,
} from "lucide-react";

const treatments = [
  {
    title: "Alzheimer e demências",
    description:
      "Acompanhamento nutricional para apoiar a alimentação e o cuidado individualizado.",
    Icon: Brain,
  },
  {
    title: "Câncer",
    description:
      "Orientação alimentar complementar durante as diferentes etapas do tratamento.",
    Icon: Ribbon,
  },
  {
    title: "Saúde cardiovascular",
    description:
      "Estratégias alimentares para apoiar o cuidado com a saúde do coração.",
    Icon: HeartPulse,
  },
  {
    title: "Diabetes",
    description:
      "Planejamento alimentar individualizado para auxiliar no controle glicêmico.",
    Icon: Droplets,
  },
  {
    title: "Colesterol e triglicerídeos",
    description:
      "Ajustes na alimentação para apoiar o cuidado com os níveis de gorduras no sangue.",
    Icon: Activity,
  },
  {
    title: "Saúde do fígado",
    description:
      "Acompanhamento nutricional em condições hepáticas, sempre integrado à equipe de saúde.",
    Icon: Stethoscope,
  },
];

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

      <div className="mt-7 flex justify-end">
        <a
          href="/agendamento"
          className="inline-flex items-center gap-3 font-sans text-base font-semibold uppercase tracking-[0.2em] text-green-900 transition-colors hover:text-green-700 sm:text-lg"
        >
          Agende sua consulta
          <ArrowRight aria-hidden="true" size={22} strokeWidth={1.8} />
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

      <section id="metodo" className="bg-[url('/img/bolas.png')] bg-[#faf8f4] px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
          <div className="flex min-h-[360px] items-end justify-center overflow-hidden rounded-[2rem] bg-[#eee8df] sm:min-h-[460px] md:h-[520px]">
            <img
              src="/img/lula.png"
              alt="Nutricionista Luana Teixeira"
              className="h-full max-h-[520px] w-full object-contain object-bottom"
            />
          </div>
          <div className="py-4 md:py-0">

            <h2 className="font-display mb-6 text-4xl font-medium leading-tight text-green-950 sm:text-5xl">
              Nutricionista Luana Teixeira
            </h2>
            <div className="mb-5 h-px w-12 bg-[#c7a38c]" />
            <p className="font-delicate text-lg leading-relaxed text-gray-600 sm:text-xl">
              Sou a <span className="font-semibold text-green-950">Dra. Luana Teixeira</span>,
              nutricionista em São Paulo, com atendimento presencial e online em todo o Brasil.
              Especializada em Nutrição Clínica, tenho experiência em ambientes hospitalares e
              no acompanhamento de doenças crônicas e condições de saúde complexas. Meu foco é
              oferecer um atendimento individualizado e promover saúde e bem-estar.
            </p>
            <a
              href="/agendamento"
              className="mt-7 mr-1s inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-green-900 transition-colors hover:text-green-700"
            >
              Mais sobre mim <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

      <section id="tratamentos" className="mt-16 bg-[url('/img/bolas.png')] bg-white px-5 py-16 sm:mt-20 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-center font-sans text-sm font-semibold uppercase tracking-[0.2em] text-green-800">
            Nossas especialidades
          </p>
          <h2 className="font-display mb-12 text-center text-3xl font-medium text-green-950 sm:text-4xl">
            Nutrição para diferentes necessidades
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {treatments.map(({ title, description, Icon }) => (
              <article
                key={title}
                className="flex h-full flex-col items-start rounded-2xl border border-gray-100 bg-[#faf8f4] p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <Icon aria-hidden="true" className="mb-5 h-10 w-10 text-lime-700/70" strokeWidth={1.8} />
                <div>
                  <h3 className="mb-2 font-sans text-lg font-semibold text-gray-800">
                    {title}
                  </h3>
                  <p className="font-delicate leading-relaxed text-gray-600">
                    {description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
