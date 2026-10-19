import { useState } from "react";

function USERH_Menu({ icone, children }) {
  const [IsOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((aberto) => !aberto)}
        aria-label={IsOpen ? "Fechar menu do perfil" : "Abrir menu do perfil"}
        aria-expanded={IsOpen}
        className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-900"
      >
        {icone}
      </button>
      <section
        aria-label="Menu do perfil"
        className={`${IsOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0 pointer-events-none"} absolute right-0 top-full z-50 mt-3 w-[min(18rem,calc(100vw-2rem))] origin-top-right rounded-2xl border border-emerald-900/10 bg-[#f7f5ee] p-2 text-emerald-950 shadow-xl shadow-emerald-950/20 transition-all duration-200`}
        onClick={(event) => {
          if (event.target.closest("a, button")) {
            setIsOpen(false);
          }
        }}
      >
        {children}
      </section>
    </div>
  );
}

export default USERH_Menu;
