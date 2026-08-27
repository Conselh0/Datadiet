function Cards() {
  return (
    <div className="bg-white p-8 rounded-xl flex flex-col items-center max-w-70 h-60 justify-between m-3 shadow-2xl">
      <img src="/img/luana.png" alt="" className="rounded-[300px] w-[40%]" />
      <h1 className="m-5 text-xl">Luana</h1>
      <p className="bg-green-500/30 w-full border-1 border-green-400 rounded-3xl text-green-600">
        Clínica e Hospitalar
      </p>
    </div>
  );
}

export default Cards;
