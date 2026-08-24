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
        className={`${IsOpen ? "block" : "hidden"} flex flex-col text-center absolute right-0 w-fit  bg-green-500`}
      >
        {children}
      </section>
    </div>
  );
}

export default USERH_Menu;
