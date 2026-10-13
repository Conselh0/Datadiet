import { useState } from "react";
import { Link } from "react-router-dom";
import HamburguerMenu from "./ADMH_Menu";
import useNutricionista from "../hooks/useNutricionista";
import { iniciais } from "../utils/formatters";
import { List } from "lucide-react";

const estiloLink =
  "flex items-center w-full justify-center text-center rounded-xl text-sm p-5 lg:p-10 hover:bg-gray-600 transition-colors duration-200";

function Sidebar() {
  const { nutricionista, carregando } = useNutricionista();
  const [fotoQuebrada, setFotoQuebrada] = useState(false);

  const nome = carregando ? "Carregando..." : nutricionista?.nome || "Nutricionista";

  return (
    <div className="flex flex-row relative justify-between lg:flex-col lg:w-fit lg:min-h-screen lg:w-70 bg-gray-500">
      {/* Foto do nutricionista (ou as iniciais, se não tiver foto) */}
      {nutricionista?.foto && !fotoQuebrada ? (
        <img
          src={nutricionista.foto}
          alt={nutricionista.nome}
          onError={() => setFotoQuebrada(true)}
          className="rounded-[300px] border-2 w-20 lg:w-50 aspect-square object-cover lg:m-auto"
        />
      ) : (
        <div className="rounded-[300px] border-2 w-20 lg:w-50 aspect-square lg:m-auto bg-gray-400 flex items-center justify-center text-white text-3xl lg:text-7xl font-bold">
          {nutricionista ? iniciais(nutricionista.nome) : ""}
        </div>
      )}

      <p className="hidden lg:block lg:text-white lg:text-center lg:text-4xl lg:font-bold">
        {nome} <br />
      </p>
      <p className="hidden lg:block lg:text-white lg:text-center">
        {nutricionista && `ID: ${nutricionista._id.slice(-6).toUpperCase()}`}
      </p>

      {/* HamburguerMenu sem a tag <button> externa para limpar o HTML */}
      <HamburguerMenu
        icone={<List className="cursor-pointer" color="white" size={40} />}
      >
        <section className="bg-gray-400 rounded-xl">
          <Link to="/Admin" className={estiloLink}>
            PERFIL
          </Link>
          <Link to="/Admin/Historico" className={estiloLink}>
            HISTÓRICO DE CONSULTAS
          </Link>
          <Link to="/Admin/Pacientes" className={estiloLink}>
            PACIENTES
          </Link>
          <Link to="/CadNu" className={estiloLink}>
            CADASTRO NUTRI
          </Link>

          {/* Alterado: Agora é um Link direto para a Home, sem interceptação ou modais */}
          <Link to="/" className={estiloLink}>
            SAIR
          </Link>
        </section>
      </HamburguerMenu>
    </div>
  );
}

export default Sidebar;
