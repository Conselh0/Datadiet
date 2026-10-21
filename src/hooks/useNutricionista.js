import { useEffect, useState } from "react";
import { buscarNutricionista } from "../services/nutricionistaService";
import { getSessao } from "../utils/sessao";

// Devolve o perfil real do nutricionista logado, vindo do banco
export default function useNutricionista() {
  const [nutricionista, setNutricionista] = useState(null);
  const [carregando, setCarregando] = useState(() => {
    const sessao = getSessao();
    return Boolean(
      sessao?.tipo === "nutricionista" && (sessao.id || sessao._id),
    );
  });
  const [erro, setErro] = useState("");

  useEffect(() => {
    const sessao = getSessao();
    const id = sessao?.tipo === "nutricionista" ? sessao.id || sessao._id : null;
    if (!id) return;
    let ativo = true;
    const sincronizarPerfil = (evento) => {
      if (evento.detail?._id === id) {
        setNutricionista(evento.detail);
      }
    };
    window.addEventListener("nutricionista-atualizado", sincronizarPerfil);

    buscarNutricionista(id)
      .then((dados) => {
        if (ativo) setNutricionista(dados);
      })
      .catch((e) => {
        if (ativo) setErro(e.message);
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
      window.removeEventListener("nutricionista-atualizado", sincronizarPerfil);
    };
  }, []);

  return { nutricionista, carregando, erro };
}
