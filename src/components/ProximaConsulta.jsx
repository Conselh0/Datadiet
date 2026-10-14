import { useEffect, useState } from "react";
import { buscarProximaConsulta, getUsuarioId } from "../services/agendamentoService";
import { formatarData } from "../utils/formatters";

function Info({ titulo, valor }) {
  return (
    <div className="flex-1 rounded-2xl bg-green-50 p-4 md:p-6 text-center">
      <p className="text-xs md:text-sm font-bold text-green-700">{titulo}</p>
      <p className="mt-1 text-2xl md:text-4xl font-bold text-green-950">{valor}</p>
    </div>
  );
}

// Coloque dentro da tela de Perfil: <ProximaConsulta />
// Passe refresh={numero} para recarregar depois de um novo agendamento
function ProximaConsulta({ refresh }) {
  const [consulta, setConsulta] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const id = getUsuarioId();
    if (!id) return;
    buscarProximaConsulta(id)
      .then(setConsulta)
      .catch((e) => setErro(e.message));
  }, [refresh]);

  return (
    <section className="w-full rounded-3xl bg-green-950 p-5 md:p-8 shadow-xl">
      <h2 className="mb-4 text-xl md:text-2xl font-bold text-white">
        Sua próxima consulta
      </h2>

      <div className="rounded-2xl bg-white p-3 md:p-4">
        <div className="flex flex-col gap-3 md:flex-row md:gap-6">
          <Info
            titulo="DATA"
            valor={consulta ? formatarData(consulta.data) : "--/--/----"}
          />
          <Info titulo="HORÁRIO" valor={consulta ? consulta.horario : "--:--"} />
        </div>
      </div>

      <p className="mt-4 text-center text-sm text-green-200">
        {erro
          ? erro
          : consulta
          ? `Com ${consulta.nutricionista} · ${consulta.status}`
          : "Você não tem consultas marcadas. Use “Agendar” para escolher um horário."}
      </p>
    </section>
  );
}

export default ProximaConsulta;
