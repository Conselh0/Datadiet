import { useState } from "react";
import { iniciais } from "../utils/formatters";

// Card do nutricionista. Com onClick vira um botão selecionável.
function NutricionistaCard({ nutricionista, selecionado = false, onClick }) {
  const [fotoQuebrada, setFotoQuebrada] = useState(false);
  const Tag = onClick ? "button" : "div";

  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`w-60 rounded-2xl bg-white p-5 text-center shadow-lg transition ${
        onClick ? "cursor-pointer hover:-translate-y-1 hover:shadow-xl" : ""
      } ${selecionado ? "ring-4 ring-green-600" : ""}`}
    >
      {nutricionista.foto && !fotoQuebrada ? (
        <img
          src={nutricionista.foto}
          alt={nutricionista.nome}
          onError={() => setFotoQuebrada(true)}
          className="mx-auto h-24 w-24 rounded-full object-cover"
        />
      ) : (
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-200 text-3xl font-bold text-green-800">
          {iniciais(nutricionista.nome) || "?"}
        </div>
      )}

      <p className="mt-3 text-xl text-black">{nutricionista.nome}</p>

      <span className="mt-3 inline-block rounded-full border border-green-500 bg-green-200/60 px-4 py-0.5 text-green-800">
        {nutricionista.especialidade}
      </span>

      {nutricionista.crn && (
        <p className="mt-2 text-xs text-gray-500">CRN {nutricionista.crn}</p>
      )}
    </Tag>
  );
}

export default NutricionistaCard;
