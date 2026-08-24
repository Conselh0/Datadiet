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
        className={`${isOpen ? "block" : "hidden"}  max-w-[400px] lg:flex lg:flex-col text-center lg:mt-4 mt-20 absolute right-0 top-0 lg:relative lg:mt-5  text-white bg-gray-400 font-bold w-full`}
      >
        {children}
      </section>
    </div>
  );
}

export default HamburguerMenu;
