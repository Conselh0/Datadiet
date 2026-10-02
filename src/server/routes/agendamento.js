import express from "express";
import AgendamentoModel, { STATUS } from "../models/agendamento.model.js";

const router = express.Router();

// "AAAA-MM-DD HH:MM" no horário de Brasília (compara como texto)
const agora = () =>
  new Date()
    .toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" })
    .slice(0, 16);

// POST /agendamento  -> cria uma consulta
router.post("/agendamento", async (req, res) => {
  try {
    const { paciente, pacienteId, nutricionista, data, horario } = req.body;

    if (!paciente || !nutricionista || !data || !horario) {
      return res
        .status(400)
        .json({ erro: "Preencha todos os campos do agendamento." });
    }

    if (`${data} ${horario}` < agora()) {
      return res
        .status(400)
        .json({ erro: "Escolha uma data e horário futuros." });
    }

    // Impede dois agendamentos no mesmo horário com o mesmo nutricionista
    const ocupado = await AgendamentoModel.findOne({
      nutricionista,
      data,
      horario,
      status: { $ne: "Cancelado" },
    });
    if (ocupado) {
      return res
        .status(409)
        .json({ erro: "Este horário já está ocupado. Escolha outro." });
    }

    const novo = await AgendamentoModel.create({
      paciente,
      pacienteId,
      nutricionista,
      data,
      horario,
    });

    res
      .status(201)
      .json({ mensagem: "Consulta agendada com sucesso!", agendamento: novo });
  } catch (error) {
    console.error("ERRO NO AGENDAMENTO:", error);
    res.status(500).json({ erro: error.message });
  }
});

// GET /agendamentos?pacienteId=&nutricionista=&status=
router.get("/agendamentos", async (req, res) => {
  try {
    const { pacienteId, nutricionista, status } = req.query;
    const filtro = {};
    if (pacienteId) filtro.pacienteId = pacienteId;
    if (nutricionista) filtro.nutricionista = nutricionista;
    if (status && STATUS.includes(status)) filtro.status = status;

    const lista = await AgendamentoModel.find(filtro).sort({
      data: -1,
      horario: -1,
    });
    res.json(lista);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// GET /agendamentos/proximo?pacienteId=  -> próxima consulta do paciente
router.get("/agendamentos/proximo", async (req, res) => {
  try {
    const { pacienteId } = req.query;
    if (!pacienteId) return res.status(400).json({ erro: "Informe o paciente." });

    const futuras = await AgendamentoModel.find({
      pacienteId,
      status: { $in: ["Pendente", "Confirmado"] },
      data: { $gte: agora().slice(0, 10) },
    }).sort({ data: 1, horario: 1 });

    const proxima = futuras.find((a) => `${a.data} ${a.horario}` >= agora());
    res.json(proxima || null);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// GET /agendamentos/ocupados?nutricionista=&data=  -> horários já tomados
router.get("/agendamentos/ocupados", async (req, res) => {
  try {
    const { nutricionista, data } = req.query;
    if (!nutricionista || !data) return res.json([]);
    const lista = await AgendamentoModel.find({
      nutricionista,
      data,
      status: { $ne: "Cancelado" },
    }).select("horario");
    res.json(lista.map((a) => a.horario));
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// PATCH /agendamento/:id/status  -> confirmar, concluir ou cancelar
router.patch("/agendamento/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!STATUS.includes(status)) {
      return res.status(400).json({ erro: "Status inválido." });
    }
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
