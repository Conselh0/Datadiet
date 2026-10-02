import { useEffect, useState } from "react";
import Cards from "../components/Cards";
import {
  criarAgendamento,
  buscarHorariosOcupados,
  getUsuario,
} from "../services/agendamentoService";

// Data de hoje no formato AAAA-MM-DD (impede escolher datas passadas)
const hoje = () => new Date().toLocaleDateString("sv-SE");

function Agendamentos() {
  // Estados para armazenar as informações digitadas/selecionadas
  const [nutricionista, setNutricionista] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [ocupados, setOcupados] = useState([]);
  const [enviando, setEnviando] = useState(false);

  // Sempre que mudar o nutricionista ou a data, busca os horários já ocupados
  useEffect(() => {
    if (!nutricionista || !data) {
      setOcupados([]);
      return;
    }
    buscarHorariosOcupados(nutricionista, data)
      .then(setOcupados)
      .catch(() => setOcupados([]));
  }, [nutricionista, data]);

  // Função para enviar os dados para o servidor backend
  const lidarComAgendamento = async (e) => {
    e.preventDefault();

    const usuario = getUsuario();
    if (!usuario.nome) {
      alert("❌ Não foi possível identificar o paciente. Abra o seu perfil e tente novamente.");
      return;
    }

    if (ocupados.includes(horario)) {
      alert("❌ Este horário já está ocupado. Escolha outro.");
      return;
    }

    try {
      setEnviando(true);
      const dados = await criarAgendamento({
        paciente: usuario.nome,
        pacienteId: usuario.id,
        nutricionista,
        data,
        horario,
      });

      alert("🎉 " + dados.mensagem);
      // Limpa os campos após o sucesso
      setData("");
      setHorario("");
      setNutricionista("");
    } catch (error) {
      alert("❌ Erro: " + error.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="bg-[url('/img/bolas.png')] w-full min-h-screen bg-green-400/20 flex flex-col justify-center items-center text-center p-4">
      <h1 className="text-3xl md:text-5xl font-bold text-green-700 mb-8">
        AGENDE SUA CONSULTA
      </h1>

      {/* Grid visual dos Nutricionistas */}
      <div className="flex flex-wrap justify-center gap-6 mb-8">
        <Cards />
      </div>

      {/* Formulário de Agendamento */}
      <form
        onSubmit={lidarComAgendamento}
        className="bg-white p-6 rounded-2xl shadow-lg flex flex-col gap-4 w-full max-w-sm text-left"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Selecione o Nutricionista:
          </label>
          <select
            value={nutricionista}
            onChange={(e) => setNutricionista(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          >
            <option value="">Escolha um profissional...</option>
            <option value="Dr. Carlos Silva">Dr. Carlos Silva (Clínico)</option>
            <option value="Dra. Ana Costa">Dra. Ana Costa (Esportiva)</option>
            <option value="Dr. Roberto Souza">Dr. Roberto Souza (Comportamental)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data da Consulta:
          </label>
          <input
            type="date"
            min={hoje()}
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Horário:
          </label>
          <input
            type="time"
            value={horario}
            onChange={(e) => setHorario(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          {ocupados.length > 0 && (
            <p className="mt-1 text-xs text-red-600">
              Horários já ocupados nesse dia: {[...ocupados].sort().join(", ")}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={enviando}
          className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-bold py-2 px-4 rounded-lg transition duration-200 mt-2"
        >
          {enviando ? "Agendando..." : "Confirmar Agendamento"}
        </button>
      </form>
    </div>
  );
}

export default Agendamentos;
