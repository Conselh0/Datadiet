import { useEffect, useState } from "react";
import StatusBadge from "./StatusBadge";
import { listarAgendamentos, atualizarStatus } from "../services/agendamentoService";
import { formatarData, iniciais } from "../utils/formatters";

function Acoes({ item, onMudar, carregando }) {
  if (item.status === "Cancelado" || item.status === "Concluído") return null;
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {item.status === "Pendente" && (
        <button
          disabled={carregando}
          onClick={() => onMudar(item._id, "Confirmado")}
          className="rounded-md bg-green-700 px-3 py-1 text-xs md:text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-50"
        >
          Confirmar
        </button>
      )}
      {item.status === "Confirmado" && (
        <button
          disabled={carregando}
          onClick={() => onMudar(item._id, "Concluído")}
          className="rounded-md bg-blue-600 px-3 py-1 text-xs md:text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Concluir
        </button>
      )}
      <button
        disabled={carregando}
        onClick={() => onMudar(item._id, "Cancelado")}
        className="rounded-md border border-red-300 px-3 py-1 text-xs md:text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
      >
        Cancelar
      </button>
    </div>
  );
}

// Use <Agendamentos nutricionista="Ana Clara" /> para ver só as consultas dela
function Agendamentos({ nutricionista }) {
  const [lista, setLista] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const carregar = async () => {
    try {
      setErro("");
      setLista(await listarAgendamentos({ nutricionista }));
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregar();
  }, [nutricionista]);

  const mudarStatus = async (id, status) => {
    try {
      setCarregando(true);
      await atualizarStatus(id, status);
      await carregar();
    } catch (e) {
      setErro(e.message);
      setCarregando(false);
    }
  };

  if (erro)
    return (
      <p className="rounded-md bg-red-100 p-4 text-center text-red-700">{erro}</p>
    );

  if (!carregando && lista.length === 0)
    return (
      <p className="rounded-xl bg-white p-8 text-center text-gray-600 shadow">
        Nenhuma consulta agendada ainda.
      </p>
    );

  return (
    <div className="w-full">
      {/* Tabela: telas médias e grandes */}
      <div className="hidden md:block overflow-hidden rounded-xl bg-white shadow-lg">
        <table className="w-full text-center">
          <thead>
            <tr className="bg-green-900 text-white text-sm lg:text-base">
              <th className="p-3">NÚMERO DO ATENDIMENTO</th>
              <th className="p-3">NOME DO PACIENTE</th>
              <th className="p-3">DATA DO AGENDAMENTO</th>
              <th className="p-3">STATUS</th>
              <th className="p-3">AÇÕES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {lista.map((a) => (
              <tr key={a._id} className="hover:bg-green-50">
                <td className="p-3 font-bold text-slate-700">{a.numero}</td>
                <td className="p-3">
                  <div className="flex items-center justify-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-xs font-bold text-slate-700">
                      {iniciais(a.paciente)}
                    </span>
                    {a.paciente}
                  </div>
                </td>
                <td className="p-3">
                  <p className="font-bold text-slate-800">{formatarData(a.data)}</p>
                  <p className="text-sm text-gray-500">{a.horario}</p>
                </td>
                <td className="p-3">
                  <StatusBadge status={a.status} />
                </td>
                <td className="p-3">
                  <Acoes item={a} onMudar={mudarStatus} carregando={carregando} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards: celular */}
      <div className="md:hidden space-y-3">
        {lista.map((a) => (
          <div key={a._id} className="rounded-xl bg-white p-4 shadow">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-500">
                Atendimento #{a.numero}
              </span>
              <StatusBadge status={a.status} />
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-300 text-xs font-bold text-slate-700">
                {iniciais(a.paciente)}
              </span>
              <div>
                <p className="font-semibold text-slate-800">{a.paciente}</p>
                <p className="text-sm text-gray-500">
                  {formatarData(a.data)} às {a.horario}
                </p>
              </div>
            </div>
            <div className="mt-3">
              <Acoes item={a} onMudar={mudarStatus} carregando={carregando} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Agendamentos;
