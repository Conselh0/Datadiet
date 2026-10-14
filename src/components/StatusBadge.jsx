const ESTILOS = {
  Confirmado: "bg-green-100 text-green-700 [&>span]:bg-green-500",
  Pendente: "bg-yellow-100 text-yellow-800 [&>span]:bg-yellow-500",
  Concluído: "bg-blue-100 text-blue-700 [&>span]:bg-blue-500",
  Cancelado: "bg-red-100 text-red-700 [&>span]:bg-red-500",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs md:text-sm font-semibold ${
        ESTILOS[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      <span className="h-2 w-2 rounded-full" />
      {status}
    </span>
  );
}

export default StatusBadge;

// Selo do pedido em andamento (reagendamento/cancelamento)
export function PedidoBadge({ solicitacao }) {
  if (!solicitacao) return null;
  const doPaciente = solicitacao.origem === "paciente";
  const texto =
    solicitacao.tipo === "Cancelamento"
      ? "Cancelamento solicitado"
      : doPaciente
      ? "Reagendamento solicitado"
      : "Reagendamento proposto";

  return (
    <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-800">
      {texto}
    </span>
  );
}
