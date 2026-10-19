import { useState } from "react";
import { X } from "lucide-react";

function HamburguerMenu({ children, icone }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white lg:hidden"
        onClick={() => setIsOpen((aberto) => !aberto)}
        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={26} /> : icone}
      </button>

      <section
        className={`${isOpen ? "block" : "hidden"}  max-w-[400px] z-50 lg:flex lg:flex-col text-center border-1 border-black lg:mt-4 rounded-xl mt-20 absolute right-0 top-0 lg:relative text-white font-bold w-full`}
      >
        {children}
      </section>
    </div>
  );
}

export default HamburguerMenu;
