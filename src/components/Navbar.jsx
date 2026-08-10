import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="w-full bg-emerald-600 flex justify-between p-3">
      <img
        src="/img/logo 2.png"
        alt="logoLuana"
        className="w-[50px] h-[50px]"
      />
      <button className="mx-3">
        <Link to="/">Home</Link>
      </button>

      <button className="mx-3">
        <Link to="/">Sobre</Link>
      </button>

      <button className="mx-3">
        <Link to="/">Feedback</Link>
      </button>

      <button className="mx-3">
        <Link to="/">Contatos</Link>
      </button>

      <img src="/img/avatar.png" alt="" className="w-[50px] h-[50px]" />
    </div>
  );
}

export default Navbar;
