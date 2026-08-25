function FichaAnam() {
  return (
    <main className="bg-orange-50/50 bg-full flex items-center bg-[url('./img/bolas.png')]  ">
      <section className="w-160 mx-auto p-4 rounded-2xl bg-taupe-50/70 shadow-2xl mt-10 mb-10">
        <h2 className="text-3xl mb-4">Ficha de anamnese nutricional</h2>

        <form method="post" className="">
          <label for="text" className="font-semibold">
            Peso corporal:
          </label>
          <br />
          <input
            type="text"
            Placeholder="   Digite seu peso"
            className="bg-white shadow-md rounded-lg w-full h-10 mb-5"
          />
          <label for="text" className="font-semibold">
            Altura:
          </label>
          <br />
          <input
            type="text"
            placeholder="   Digite sua altura"
            className="bg-white shadow-md rounded-lg w-full h-10 mb-5"
          />
          <label for="text" className="font-semibold">
            Peso ideal:
          </label>
          <br />
          <input
            type="text"
            Placeholder="   Digite seu peso ideal"
            className="bg-white shadow-md rounded-lg w-full h-10 mb-5"
          />
          <label for="text" className="font-semibold">
            Você possui alguma das seguintes patologias?
          </label>
          <br />
          <input type="checkbox" />
          <label> Diabete</label>
          <br />
          <input type="checkbox" />
          <label> Hipertensão</label>
          <br />
          <input type="checkbox" />
          <label> Gastrite</label>
          <br />
          <input type="checkbox" />
          <label> Asma</label>
          <br />
          <input type="checkbox" />
          <label> Bronquite</label>
          <br />
          <input type="checkbox" />
          <label> Outra. Qual?</label>
          <input
            type="text"
            Placeholder="   Digite aqui"
            className="bg-white shadow-md rounded-lg ml-3 mb-5"
          />
          <br />
          <label for="text" className="font-semibold">
            Você tem casos na família de alguma das seguintes patologias?
          </label>
          <br />
          <input type="checkbox" />
          <label> Diabete</label>
          <br />
          <input type="checkbox" />
          <label> Hipertensão</label>
          <br />
          <input type="checkbox" />
          <label> Doenças cardiovasculares</label>
          <br />
          <input type="checkbox" />
          <label> Derrame</label>
          <br />
          <input type="checkbox" />
          <label> Câncer</label>
          <br />
          <input type="checkbox" />
          <label> Câncer</label>
          <br />
          <input type="checkbox" />
          <label> Outra. Qual?</label>
          <input
            type="text"
            Placeholder="   Digite aqui"
            className="bg-white shadow-md rounded-lg ml-3 mb-5"
          />
          <br />
          <label className="font-semibold">
            {" "}
            Possui alergia a algum alimento? Se sim, qual?
          </label>
          <input
            type="text"
            Placeholder="   Digite aqui"
            className="bg-white shadow-md rounded-lg ml-2 mb-5"
          />
          <br />
          <label className="font-semibold">
            {" "}
            Possui intolerância a algum alimento? Se sim, qual?
          </label>
          <input
            type="text"
            Placeholder="   Digite aqui"
            className="bg-white shadow-md rounded-lg ml-2 mb-5"
          />
          <br />
          <label className="font-semibold">
            {" "}
            Você consume bebida alcólica?
          </label>{" "}
          <br />
          <input type="radio" name="bebida" />
          <label> Sim</label>
          <input type="radio" name="bebida" className="ml-5" />
          <label> Não</label>
          <br />
          <label className="font-semibold"> Você fuma?</label> <br />
          <input type="radio" name="fuma" />
          <label> Sim</label>
          <input type="radio" name="fuma" className="ml-5 " />
          <label> Não</label>
          <br />
          <label className="font-semibold">
            {" "}
            Você pratica alguma atividade física?
          </label>{" "}
          <br />
          <input type="radio" name="atividadeFisica" />
          <label> Sim</label>
          <input type="radio" name="atividadeFisica" className="ml-5" />
          <label> Não</label>
          <br />
          <label className="font-semibold">
            {" "}
            Como é seu funcionamento intestinal?
          </label>{" "}
          <br />
          <input type="radio" name="funcionamentoIntestinal" />
          <label> Regular</label>
          <input type="radio" name="funcionamentoIntestinal" className="ml-5" />
          <label> Irregular</label>
          <br />
          <label className="font-semibold">
            {" "}
            Você sente desconforto intestinal ou dificuldade para ir ao
            banheiro?
          </label>{" "}
          <br />
          <input type="radio" name="desconfortoIntestinal" />
          <label> Sim</label>
          <input type="radio" name="desconfortoIntestinal" className="ml-5" />
          <label> Não</label>
          <br />
          <label className="font-semibold">
            {" "}
            Você costuma se sentir cansado ou desanimado frequentemente?
          </label>{" "}
          <br />
          <input type="radio" name="casaço" />
          <label> Sim</label>
          <input type="radio" name="casaço" className="ml-5" />
          <label> Não</label>
          <br />
          <br />
          <label for="text" className="font-semibold">
            Quantos litros de água você consome diariamente?
          </label>
          <br />
          <input
            type="text"
            Placeholder="   Exemplo: 2 Litros"
            className="bg-white shadow-md rounded-lg w-full h-10 mb-5"
          />
          <br />
          <label for="text" className="font-semibold">
            Descreva o seu café da manhã:
          </label>
          <br />
          <input
            type="text"
            Placeholder="   Exemplo: 1 pão, 2 ovos..."
            className="bg-white shadow-md rounded-lg w-full h-10 mb-5"
          />
          <br />
          <label for="text" className="font-semibold">
            Descreva o seu almoço:
          </label>
          <br />
          <input
            type="text"
            Placeholder="   Exemplo: Arroz, feijão, filé de frango..."
            className="bg-white shadow-md rounded-lg w-full h-10 mb-5"
          />
          <br />
          <label for="text" className="font-semibold">
            Descreva o seu jantar:
          </label>
          <br />
          <input
            type="text"
            Placeholder="   Exemplo: Macarrão, carne moida..."
            className="bg-white shadow-md rounded-lg w-full h-10 mb-5"
          />
          <br />
          <label for="text" className="font-semibold">
            Você realiza uma outra refeição? Se sim, descreva:
          </label>
          <br />
          <input
            type="text"
            Placeholder="   No café da tarde eu como..."
            className="bg-white shadow-md rounded-lg w-full h-10 mb-5"
          />
          <br />
          <br />
          <center>
            <button className="bg-green-500 mx-auto shadow-md rounded-lg w-full h-10 text-white">
              <b>Enviar ficha</b>
            </button>
          </center>
          <br />
        </form>
      </section>
    </main>
  );
}

export default FichaAnam;
