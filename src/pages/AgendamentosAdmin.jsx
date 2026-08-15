import { CalendarDays } from "lucide-react";
import Agendamentos from "../components/Agendamentos";

function AgendamentosAdmin() {
  return (
    <div>
      <div className="flex items-center text-2xl font-bold">
        <CalendarDays size={40} />
        <h2>AGENDAMENTOS</h2>
      </div>
      <Agendamentos />
    </div>
  );
}

export default AgendamentosAdmin;
