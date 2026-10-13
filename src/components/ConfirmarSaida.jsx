import { useEffect } from "react";
import { LogOut, X } from "lucide-react";

// <ConfirmarSaida onCancelar={...} onConfirmar={...} />
function ConfirmarSaida({ onCancelar, onConfirmar }) {
  // Fecha com a tecla Esc
  useEffect(() => {
    const aoTeclar = (e) => e.key === "Escape" && onCancelar();
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [onCancelar]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onCancelar}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-sair"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl"
      >
        <button
          type="button"
          onClick={onCancelar}
          aria-label="Fechar"
          className="absolute right-4 top-4 cursor-pointer text-gray-500 hover:text-gray-800"
        >
          <X size={20} />
        </button>

        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <LogOut className="text-green-700" />
        </div>

        <h2 id="titulo-sair" className="text-xl font-bold text-green-950">
          Deseja sair?
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Tem certeza que deseja sair da sua conta?
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={onCancelar}
            className="cursor-pointer rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            className="cursor-pointer rounded-md bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
          >
            Sim, sair
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmarSaida;
