function HomeBackground({ children }) {
  return (
    <div>
      <section className="mt-8 mb-8 flex h-full w-full flex-col items-center gap-6 bg-[url('/img/bolas.png')] bg-[#f3f0e9] px-4 py-8 sm:mt-20 sm:mb-20 sm:flex-row sm:justify-between sm:gap-0 sm:px-0 sm:py-0">
        {children}
      </section>
    </div>
  );
}

export default HomeBackground;
