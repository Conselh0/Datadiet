import { useState } from "react";

function HamburguerMenu({ children, icone }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      {/*O que faz o interruptor do useState funcionar */}
      <button className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
        {icone}
      </button>

      {/*O que vai linkar o button com os links*/}
      <section
        className={`${isOpen ? "block" : "hidden"}  max-w-[400px] z-50 lg:flex lg:flex-col text-center border-1 border-black lg:mt-4 rounded-xl mt-20 absolute right-0 top-0 lg:relative text-white font-bold w-full`}
      >
        {children}
      </section>
    </div>
  );
}

export default HamburguerMenu;
