function Feedback() {
  return (
    <main className="containe w-full bg-emerald-900 mt-5 mb-5" >
      
      <div className="grid md:grid-cols-3 gap-10 p-20"> 

      <section className="max-w-90 mx-auto p-4 rounded-2xl border-amber-50 border-4">
        
        <img src="../img/open.png" className="w-16 h-16 mx-2"/>
        <p className="text-white p-3 text-xl"><center>Amei o atendimento! A nutricionista é muito atenciosa e dedicada, e já estou percebendo resultados incríveis em poucos meses. Estou muito satisfeita com o acompanhamento!</center></p>
        <img src="../img/mulher.jpg" className="w-24 h-24 rounded-full mx-auto my-3" />
        <p className="text-white my-3 text-xl"><center>Ana Clara</center></p>

      </section>

      <section className="max-w-90 mx-auto p-4 rounded-2xl border-amber-50 border-4">
        
        <img src="../img/open.png" className="w-16 h-16 mx-2"/>
        <p className="text-white p-3 text-xl mt-4"><center>A doutora foi essencial para me ajudar a montar uma alimentação que realmente se encaixasse na minha rotina. As orientações foram claras e fizeram toda a diferença para eu conseguir manter uma dieta equilibrada no dia a dia.</center></p>
        <img src="../img/Ana_Souza_Ferreira.jpg" className="w-24 h-24 rounded-full mx-auto mt-6" />
        <p className="text-white my-3 text-xl"><center>Renata Cardoso</center></p>

      </section>
      
      <section className="max-w-90 mx-auto p-4 rounded-2xl border-amber-50 border-4">
        
        <img src="../img/open.png" className="w-16 h-16 mx-2"/>
        <p className="text-white p-3 text-xl"><center>Estava enfrentando problemas com o colesterol, mas com o acompanhamento e as orientações da nutri, consegui melhorar meus resultados. Estou muito satisfeita com o atendimento e com a evolução!</center></p>
        <img src="../img/renatocleber.jpg" className="w-24 h-24 rounded-full mx-auto my-3" />
        <p className="text-white my-3 text-xl"><center>Renato Cleber</center></p>

      </section>

      </div>

      

    </main>
  );
}

export default Feedback;
