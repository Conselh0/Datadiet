import { useEffect, useState } from "react";
import { buscarNutricionista } from "../services/nutricionistaService";
import { getSessao } from "../utils/sessao";

// Devolve o perfil real do nutricionista logado, vindo do banco
export default function useNutricionista() {
  const [nutricionista, setNutricionista] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const sessao = getSessao();
    const id = sessao?.tipo === "nutricionista" ? sessao.id || sessao._id : null;
    if (!id) {
      setCarregando(false);
      return;
    }
    buscarNutricionista(id)
      .then(setNutricionista)
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false));
  }, []);

  return { nutricionista, carregando, erro };
}
