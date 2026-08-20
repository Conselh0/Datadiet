import { CircleUserRoundIcon } from "lucide-react";
import { Link } from "react-router-dom";
import HamburguerMenu from "./HambuerguerMenu";

function Navbar() {
  return (
    <div className="w-full bg-emerald-900 flex justify-between p-3">
      <img
        src="/img/logo 2.png"
        alt="logoLuana"
        className="hidden sm:block w-[50px] h-[50px]"
      />

      <div className="flex flex-col items-start sm:items-center sm:flex-row sm:justify-center text-[3vw] lg:text-3xl text-white">
        <button className="mx-3 hover:underline decoration-2 decoration-green-400 underline-offset-4">
          <Link to="/">Home</Link>
        </button>

        <button className="mx-3 hover:underline decoration-2 decoration-green-400 underline-offset-4">
          <Link to="/">Sobre</Link>
        </button>

        <button className="mx-3 hover:underline decoration-2 decoration-green-400 underline-offset-4">
          <Link to="/Feedback">Feedback</Link>
        </button>

        <button className="mx-3 hover:underline decoration-2 decoration-green-400 underline-offset-4">
          <Link to="/">Contatos</Link>
        </button>
      </div>
      <button>
        <HamburguerMenu
          icone={
            <CircleUserRoundIcon
              className="cursor-pointer"
              color="white"
              size={50}
            />
          }
        >
          <Link to="#">PERFIL</Link>
        </HamburguerMenu>
      </button>
    </div>
  );
}

export default Navbar;
