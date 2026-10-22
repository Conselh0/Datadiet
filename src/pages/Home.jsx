{
  /*Chamando o home background para usa-lo como props. */
}
import HomeBackground from "../components/HomeBackground";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  Brain,
  Droplets,
  HeartPulse,
  Quote,
  Ribbon,
  Scale,
} from "lucide-react";

const treatments = [
  {
    title: "Emagrecimento",
    description:
      "Acompanhamento nutricional individualizado para construir hábitos saudáveis e alcançar seus objetivos.",
    Icon: Scale,
  },
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
];

const testimonials = [
  {
    name: "Ana Clara",
    avatar: "/img/mulher.jpg",
    text: "Amei o atendimento! A nutricionista é muito atenciosa e dedicada, e já estou percebendo resultados incríveis em poucos meses. Estou muito satisfeita com o acompanhamento!",
  },
  {
    name: "Renata Cardoso",
    avatar: "/img/Ana_Souza_Ferreira.jpg",
    text: "A doutora foi essencial para me ajudar a montar uma alimentação que realmente se encaixasse na minha rotina. As orientações foram claras e fizeram toda a diferença para eu conseguir manter uma dieta equilibrada no dia a dia.",
  },
  {
    name: "Renato Cleber",
    avatar: "/img/renatocleber.jpg",
    text: "Estava enfrentando problemas com o colesterol, mas com o acompanhamento e as orientações da nutri, consegui melhorar meus resultados. Estou muito satisfeita com o atendimento e com a evolução!",
  },
];

function Home() {
  const navigate = useNavigate();

  function abrirAgendamentos() {
    const usuarioLogado = localStorage.getItem("usuario");
    navigate(usuarioLogado ? "/User/Agendamentos" : "/LoginPa");
  }

  return (
    <main className="font-poppins">
      {/*Estamos basicamete chamando a prop de fundo que já tem o estilo pré-definido*/}
      <HomeBackground>
        <img
          src="/img/LTfixed.png"
          alt="Nutricionista Luana Teixeira"
          className="block w-[88%] max-w-[340px] object-contain sm:hidden"
        />

        <main className="my-auto w-full sm:w-[58%]">
          <div className="w-full px-2 text-left text-green-950 sm:ml-4 sm:px-0">
            <h1 className="mb-5 font-display text-3xl font-semibold leading-snug tracking-normal sm:text-4xl sm:leading-tight xl:text-5xl">
              Alcance o equilíbrio, o bem-estar e resultados duradouros com atendimento nutricional{" "}
              <span className="font-display">100% online</span>{" "}
            </h1>

            <p className="mb-7 font-delicate text-base font-light leading-relaxed tracking-normal sm:text-xl xl:text-2xl">
              Protocolos individualizados para emagrecer com saúde,
              corrigir deficiências nutricionais e aumentar sua energia,
              com a praticidade de ser atendido de onde estiver.
            </p>

            <div className="mt-7 flex justify-end">
              <button
                type="button"
                onClick={abrirAgendamentos}
                className="inline-flex items-center gap-3 font-sans text-base font-semibold uppercase tracking-[0.2em] text-green-900 transition-colors hover:text-green-700 sm:text-lg"
              >
                Agende sua consulta
                <ArrowRight aria-hidden="true" size={22} strokeWidth={1.8} />
              </button>
            </div>
          </div>
        </main>

        <img
          src="/img/LTfixed.png"
          alt="Nutricionista Luana Teixeira"
          className="hidden sm:block w-[42%] h-auto max-w-xl"
        />
      </HomeBackground>

      <section id="metodo" className="bg-[url('/img/bolas.png')] bg-[#f3f0e9] px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
          <div className="flex min-h-[360px] items-end justify-center overflow-hidden rounded-[2rem] bg-white sm:min-h-[460px] md:h-[520px]">
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
              href="#contato"
              className="mt-7 mr-1 inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-green-900 transition-colors hover:text-green-700"
            >
              Entre em contato <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

      <div aria-hidden="true" className="h-16 bg-white sm:h-20" />

      <section
        id="feedback"
        className="bg-[url('/img/bolas.png')] bg-[#f3f0e9] px-5 py-16 sm:px-8 sm:py-20"
      >
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-center font-sans text-sm font-semibold uppercase tracking-[0.2em] text-green-800">
            Feedback
          </p>
          <h2 className="mb-12 text-center font-display text-3xl font-medium text-green-950 sm:text-4xl">
            O que dizem sobre o acompanhamento
          </h2>
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-3">
            {testimonials.map(({ name, text, avatar }, index) => (
              <article
                key={name}
                className={`flex h-full min-h-80 flex-col rounded-3xl bg-white p-8 shadow-[0_16px_36px_rgba(35,70,40,0.16)] ${
                  index === 1 ? "md:translate-y-8" : ""
                }`}
              >
                <img
                  src={avatar}
                  alt={`Foto de ${name}`}
                  className="mb-6 h-16 w-16 rounded-full object-cover"
                />
                <h3 className="mb-4 font-sans text-lg font-semibold text-green-800">
                  {name}
                </h3>
                <div className="flex items-start gap-3">
                  <Quote
                    aria-hidden="true"
                    className="mt-1 h-7 w-7 shrink-0 fill-green-800/40 text-green-800/40"
                  />
                  <p className="font-delicate leading-relaxed text-gray-600">
                    {text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div aria-hidden="true" className="h-16 bg-white sm:h-20" />

      <section id="tratamentos" className="bg-[url('/img/bolas.png')] bg-[#f3f0e9] px-5 py-16 sm:px-8 sm:py-20">
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

      <div aria-hidden="true" className="h-16 bg-white sm:h-20" />

      <section className="bg-[url('/img/bolas.png')] bg-[#f3f0e9] px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <h2 className="mb-3 font-display text-3xl font-medium text-green-950 sm:text-4xl">
              Que tal dar o primeiro passo para cuidar de você?
            </h2>
            <p className="font-delicate text-base text-gray-600 sm:text-lg">
              Vamos construir juntos uma alimentação mais leve, saudável e possível
              para a sua rotina. Conte comigo nessa jornada!
            </p>
          </div>
          <button
            type="button"
            onClick={abrirAgendamentos}
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-green-700 px-8 py-4 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-green-800"
          >
            Agende sua consulta
          </button>
        </div>
      </section>
    </main>
  );
}

export default Home;