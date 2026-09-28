import { useState } from "react";
import Cards from "../components/Cards";

function Agendamentos() {
  // Estados para armazenar as informações digitadas/selecionadas
  const [nutricionista, setNutricionista] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");

  // Função para enviar os dados para o servidor backend
  const lidarComAgendamento = async (e) => {
    e.preventDefault();

    try {
      const resposta = await fetch("http://localhost:8080/agendamento", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nutricionista,
          data,
          horario,
        }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        alert("🎉 " + dados.mensagem);
        // Limpa os campos após o sucesso
        setData("");
        setHorario("");
        setNutricionista("");
      } else {
        alert("❌ Erro: " + dados.erro);
      }
    } catch (error) {
      console.error("Erro ao conectar com o servidor:", error);
      alert("Erro ao conectar com o servidor backend.");
    }
  };

  return (
    <div className="bg-[url('/img/bolas.png')] w-screen h-screen bg-green-400/20 flex flex-col justify-center items-center text-center p-4">
      <h1 className="text-5xl font-bold text-green-700 mb-8">
        AGENDE SUA CONSULTA
      </h1>

      {/* Grid visual dos Nutricionistas */}
      <div className="flex gap-6 mb-8">
        <Cards />
      </div>

      {/* Formulário de Agendamento */}
      <form 
        onSubmit={lidarComAgendamento} 
        className="bg-white p-6 rounded-2xl shadow-lg flex flex-col gap-4 w-96 text-left"
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
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 mt-2"
        >
          Confirmar Agendamento
        </button>
      </form>
    </div>
  );
}

export default Agendamentos;
