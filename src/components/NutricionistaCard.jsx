import { useState } from "react";
import { iniciais } from "../utils/formatters";

// Card do nutricionista. Com onClick vira um botão selecionável.
function NutricionistaCard({
  nutricionista,
  selecionado = false,
  onClick,
  temaPaciente = false,
}) {
  const [fotoQuebrada, setFotoQuebrada] = useState(false);
  const Tag = onClick ? "button" : "div";
  const verdeAvatar = temaPaciente
    ? "bg-[#dce9df] text-[#315f3d]"
    : "bg-green-200 text-green-800";
  const verdeSelecao = temaPaciente
    ? "border-[#668b70] ring-[#668b70]"
    : "border-green-700 ring-green-600";
  const verdeEspecialidade = temaPaciente
    ? "border-[#b7cdbb] bg-[#e7efe8] text-[#315f3d]"
    : "border-green-500 bg-green-200/60 text-green-800";

  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`w-60 rounded-2xl border border-gray-200 bg-gray-100 p-5 text-center shadow-lg transition ${
        onClick ? "cursor-pointer hover:-translate-y-1 hover:shadow-xl" : ""
      } ${
        selecionado
          ? `ring-4 ring-offset-2 ${verdeSelecao}`
          : ""
      }`}
    >
      {nutricionista.foto && !fotoQuebrada ? (
        <img
          src={nutricionista.foto}
          alt={nutricionista.nome}
          onError={() => setFotoQuebrada(true)}
          className="mx-auto h-24 w-24 rounded-full object-cover"
        />
      ) : (
        <div className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full text-3xl font-bold ${verdeAvatar}`}>
          {iniciais(nutricionista.nome) || "?"}
        </div>
      )}

      <p className="mt-3 text-xl text-black">{nutricionista.nome}</p>

      <span className={`mt-3 inline-block rounded-full border px-4 py-0.5 ${verdeEspecialidade}`}>
        {nutricionista.especialidade}
      </span>

      {nutricionista.crn && (
        <p className="mt-2 text-xs text-gray-500">CRN {nutricionista.crn}</p>
      )}
    </Tag>
  );
}

export default NutricionistaCard;
