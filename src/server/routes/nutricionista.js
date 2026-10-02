import express from "express";
import mongoose from "mongoose";
import NutricionistaModel from "../models/nutricionista.model.js";
import AgendamentoModel from "../models/agendamento.model.js";
import { agora, gerarHorarios, diaDaSemana } from "../../utils/horarios.js";

const router = express.Router();

// POST /nutricionista  -> cadastra um nutricionista
router.post("/nutricionista", async (req, res) => {
  try {
    const { nome, especialidade, crn, email, foto, diasAtendimento, horaInicio, horaFim, duracao } =
      req.body;

    if (!nome || !especialidade) {
      return res.status(400).json({ erro: "Informe o nome e a especialidade." });
    }
    if (
      !Array.isArray(diasAtendimento) ||
      diasAtendimento.length === 0 ||
      !diasAtendimento.every((d) => Number.isInteger(d) && d >= 0 && d <= 6)
    ) {
      return res.status(400).json({ erro: "Escolha ao menos um dia de atendimento." });
    }
    if (!horaInicio || !horaFim || horaInicio >= horaFim) {
      return res.status(400).json({ erro: "O horário final deve ser depois do inicial." });
    }

    const novo = await NutricionistaModel.create({
      nome,
      especialidade,
      crn,
      email,
      foto,
      diasAtendimento,
      horaInicio,
      horaFim,
      duracao: Number(duracao) || 30,
    });

    res.status(201).json({ mensagem: "Nutricionista cadastrado com sucesso!", nutricionista: novo });
  } catch (error) {
    console.error("ERRO NO CADASTRO DO NUTRICIONISTA:", error);
    res.status(500).json({ erro: error.message });
  }
});

// GET /nutricionistas  -> lista todos (vira um card cada)
router.get("/nutricionistas", async (req, res) => {
  try {
    res.json(await NutricionistaModel.find().sort({ nome: 1 }));
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// GET /nutricionistas/:id/horarios?data=AAAA-MM-DD
// -> [{ hora: "08:00", livre: true }, ...]
router.get("/nutricionistas/:id/horarios", async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = req.query;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ erro: "Nutricionista não encontrado." });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data || "")) {
      return res.status(400).json({ erro: "Data inválida." });
    }

    const nutri = await NutricionistaModel.findById(id);
    if (!nutri) return res.status(404).json({ erro: "Nutricionista não encontrado." });

    // Dia em que o nutricionista não atende
    if (!nutri.diasAtendimento.includes(diaDaSemana(data))) return res.json([]);

    const ocupados = await AgendamentoModel.find({
      nutricionistaId: id,
      data,
      status: { $ne: "Cancelado" },
    }).select("horario");
    const tomados = new Set(ocupados.map((a) => a.horario));

    const lista = gerarHorarios(nutri.horaInicio, nutri.horaFim, nutri.duracao).map((hora) => ({
      hora,
      livre: !tomados.has(hora) && `${data} ${hora}` > agora(),
    }));

    res.json(lista);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

export default router;
