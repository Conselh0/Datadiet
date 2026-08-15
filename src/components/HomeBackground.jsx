function HomeBackground({ children }) {
  return (
    <div>
      <section className="h-full w-full bg-[url('./img/bolas.png')] bg-green-400/30  mt-20 mb-20 flex text-center justify-center sm:justify-between sm:text-justify ">
        {children}
      </section>
    </div>
  );
}

export default HomeBackground;
