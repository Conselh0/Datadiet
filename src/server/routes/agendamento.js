import express from "express";
import mongoose from "mongoose";
import AgendamentoModel, { STATUS } from "../models/agendamento.model.js";
import NutricionistaModel from "../models/nutricionista.model.js";

import { agora, gerarHorarios, diaDaSemana } from "../../utils/horarios.js";

const router = express.Router();

router.post("/agendamento", async (req, res) => {
  try {
    const { paciente, pacienteId, nutricionistaId, data, horario } = req.body;

    if (!paciente || !nutricionistaId || !data || !horario) {
      return res.status(400).json({ erro: "Preencha todos os campos do agendamento." });
    }
    if (!mongoose.isValidObjectId(nutricionistaId)) {
      return res.status(404).json({ erro: "Nutricionista não encontrado." });
    }

    const nutri = await NutricionistaModel.findById(nutricionistaId);
    if (!nutri) return res.status(404).json({ erro: "Nutricionista não encontrado." });

    if (!/^\d{4}-\d{2}-\d{2}\$/.test(data)) {
      return res.status(400).json({ erro: "Data inválida." });
    }
    if (!nutri.diasAtendimento.includes(diaDaSemana(data))) {
      return res.status(400).json({ erro: "O nutricionista não atende nesse dia." });
    }
    if (!gerarHorarios(nutri.horaInicio, nutri.horaFim, nutri.duracao).includes(horario)) {
      return res.status(400).json({ erro: "Horário fora do atendimento do nutricionista." });
    }
    if (`${data} ${horario}` <= agora()) {
      return res.status(400).json({ erro: "Escolha uma data e horário futuros." });
    }

    const ocupado = await AgendamentoModel.findOne({
      nutricionistaId,
      data,
      horario,
      status: { $ne: "Cancelado" },
    });
    if (ocupado) {
      return res.status(409).json({ erro: "Este horário acabou de ser ocupado. Escolha outro." });
    }

    const novo = await AgendamentoModel.create({
      paciente,
      pacienteId,
      nutricionista: nutri.nome,
      nutricionistaId,
      data,
      horario,
    });

    res.status(201).json({ mensagem: "Consulta agendada com sucesso!", agendamento: novo });
  } catch (error) {
    console.error("ERRO NO AGENDAMENTO:", error);
    res.status(500).json({ erro: error.message });
  }
});

router.get("/agendamentos", async (req, res) => {
  try {
    const { pacienteId, nutricionista, nutricionistaId, status } = req.query;
    const filtro = {};
    if (pacienteId) filtro.pacienteId = pacienteId;
    if (nutricionista) filtro.nutricionista = nutricionista;
    if (nutricionistaId) filtro.nutricionistaId = nutricionistaId;
    if (status && STATUS.includes(status)) filtro.status = status;

    res.json(await AgendamentoModel.find(filtro).sort({ data: -1, horario: -1 }));
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});


router.get("/agendamentos/proximo", async (req, res) => {
  try {
    const { pacienteId } = req.query;
    if (!pacienteId) return res.status(400).json({ erro: "Informe o paciente." });

    const futuras = await AgendamentoModel.find({
      pacienteId,
      status: { $in: ["Pendente", "Confirmado"] },
      data: { $gte: agora().slice(0, 10) },
    }).sort({ data: 1, horario: 1 });

    res.json(futuras.find((a) => `${a.data} ${a.horario}` >= agora()) || null);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

router.patch("/agendamento/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!STATUS.includes(status)) return res.status(400).json({ erro: "Status inválido." });

    const atualizado = await AgendamentoModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!atualizado) return res.status(404).json({ erro: "Consulta não encontrada." });
    res.json(atualizado);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

export default router;
