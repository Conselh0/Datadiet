{/*Chamando o home background para usa-lo como props. */}
import HomeBackground from "../components/HomeBackground";

function Home() {
  return (
    <main>
      {/*Estamos basicamete chamando a prop de fundo que já tem o estilo pré-definido*/}
      <HomeBackground>
        <h1 className="text-slate-50 text-3xl ml-4 my-auto">
          Alcance o equilíbrio, bem-estar e <br />
          resultados duradouros com <br />
          orientação nutricional <br />
          personalizada <br />
        </h1>
        <img src="/img/LTfixed.png" alt="" className="w-[50%] h-[50%]" />
      </HomeBackground>

      <HomeBackground> 
        <h1>Olá</h1>
      </HomeBackground>

      
    </main>

    
  );
}

export default Home;
