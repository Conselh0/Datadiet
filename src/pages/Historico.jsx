import { NotebookPen } from "lucide-react";
import Agendamentos from "../components/Agendamentos";

function Historico() {
  return (
    <div>
      <div className="flex items-center font-bold text-2xl">
        <NotebookPen size={40} />
        <h2>HISTÓRICO DE CONSULTAS E DIETAS PLANEJADAS</h2>
      </div>
      <Agendamentos />
    </div>
  );
}

export default Historico;
