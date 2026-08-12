function Feedback() {
  return (
    <main className="containe w-full bg-green-900 mt-5 mb-5" >
      
      <div className="grid md:grid-cols-3 gap-10 p-20"> 

      <section className="max-w-90 mx-auto p-4 rounded-2xl border-amber-50 border-4">
        
        <img src="../img/open.png" className="w-16 h-16 mx-2"/>
        <p className="text-white p-3 text-xl"><center>gostei muito do atendimento, médica antenciosa, resolveu todos os meus problemas!</center></p>
        <img src="../img/mulher.jpg" className="w-24 h-24 rounded-full mx-auto my-3" />
        <p className="text-white my-3 text-xl"><center>Maria Clara</center></p>

      </section>

      <section className="max-w-90 mx-auto p-4 rounded-2xl border-amber-50 border-4">
        
        <img src="../img/open.png" className="w-16 h-16 mx-2"/>
        <p className="text-white p-3 text-xl mt-4"><center>A doutora me ajudou bastante a criar a minha dieta.</center></p>
        <img src="../img/Ana_Souza_Ferreira.jpg" className="w-24 h-24 rounded-full mx-auto mt-6" />
        <p className="text-white my-3 text-xl"><center>Renata Cardoso</center></p>

      </section>
      
      <section className="max-w-90 mx-auto p-4 rounded-2xl border-amber-50 border-4">
        
        <img src="../img/open.png" className="w-16 h-16 mx-2"/>
        <p className="text-white p-3 text-xl"><center>Estava com problemas com colesterol, mas a médica conseguiu resolver</center></p>
        <img src="../img/Pedro_Dias_Lombardi.jpg" className="w-24 h-24 rounded-full mx-auto my-3" />
        <p className="text-white my-3 text-xl"><center>Renato Cleber</center></p>

      </section>

      </div>

      

    </main>
  );
}

export default Feedback;
