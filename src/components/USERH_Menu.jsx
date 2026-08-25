import { useState } from "react";

function USERH_Menu({ icone, children }) {
  const [IsOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => {
          setIsOpen(!IsOpen);
        }}
      >
        {icone}
      </button>
      <section
        className={`${IsOpen ? "block" : "hidden"} flex flex-col text-center absolute right-0 w-fit border-1 border-black bg-white text-black font-bold`}
      >
        {children}
      </section>
    </div>
  );
}

export default USERH_Menu;
