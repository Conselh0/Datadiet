import express from "express";
import AgendamentoModel from "../models/agendamento.model.js"; 

const router = express.Router(); // Cria um roteador do express

router.post("/agendamento", async (req, res) => {
  try {
    const { nutricionista, data, horario } = req.body;

    // Validação simples
    if (!nutricionista || !data || !horario) {
      return res.status(400).json({ erro: "Preencha todos os campos do agendamento." });
    }

    // Salva no MongoDB Atlas
    const novoAgendamento = await AgendamentoModel.create({
      nutricionista,
      data,
      horario
    });

    console.log("Consulta agendada no banco:", novoAgendamento);
    res.status(201).json({ mensagem: "Consulta agendada com sucesso!" });
  } catch (error) {
    console.error("ERRO NO AGENDAMENTO:", error);
    return res.status(500).json({ erro: error.message });
  }
});

export default router; // Exporta o roteador