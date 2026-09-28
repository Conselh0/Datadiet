import { RotateCcwClockIcon } from "lucide-react";
import HistoricoConsultas from "../components/HistoricoConsultas";

function UserHistorico() {
  return (
    <div className="">
      <h1 className="flex items-center text-5xl">
        <RotateCcwClockIcon size={70} /> HISTÓRICO DE CONSULTAS
      </h1>
      <HistoricoConsultas />
    </div>
  );
}

export default UserHistorico;
