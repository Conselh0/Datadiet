function HomeBackground({ children }) {
  return (
    <div>
      <section className="h-full w-full bg-[url('/img/bolas.png')] bg-green-400/30 mt-20 mb-20 flex justify-center sm:justify-between">
        {children}
      </section>
    </div>
  );
}

export default HomeBackground;
