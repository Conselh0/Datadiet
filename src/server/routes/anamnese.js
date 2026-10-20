import express from "express";
import mongoose from "mongoose";
import AnamneseModel from "../models/anamnese.model.js";
import AgendamentoModel from "../models/agendamento.model.js";
import UserModel from "../models/user.model.js";

const router = express.Router();
const CAMPOS = {
  inicial: [
    "pesoKg", "alturaCm", "medidaCinturaCm", "objetivoPrincipal", "objetivoOutro",
    "diagnosticos", "diagnosticoOutro", "medicamentos", "medicamentosDetalhe",
    "suplementos", "suplementosDetalhe", "alergias", "alergiaOutra",
    "restricoesAlimentares", "historicoFamiliar", "historicoFamiliarOutro", "sintomas",
    "refeicoesHabituais", "alimentosFrequentes", "aguaLitros", "atividadeFisica",
    "frequenciaAtividade", "sono", "bebidaAlcoolica", "tabagismo", "relacaoComAlimentacao",
  ],
  acompanhamento: [
    "pesoKg", "adesaoPlano", "dificuldades", "alteracoesSaude", "alteracoesSaudeDetalhe",
    "sintomas", "aguaLitros", "atividadeFisica", "frequenciaAtividade", "sono",
    "funcionamentoIntestinal", "mudancasAlimentares", "observacoes",
  ],
};

export async function obterStatusAnamnese(pacienteId) {
  const [inicial, fichaAtual] = await Promise.all([
    AnamneseModel.findOne({ pacienteId, tipo: "inicial" }).sort({ createdAt: 1 }),
    AnamneseModel.findOne({ pacienteId }).sort({ createdAt: -1 }),
  ]);

  let consultasConcluidasDesdeFicha = 0;
  if (fichaAtual?.agendamentoId) {
    const atendimentoBase = await AgendamentoModel.findOne({
      _id: fichaAtual.agendamentoId,
      pacienteId,
    }).select("data horario");

    if (atendimentoBase) {
      consultasConcluidasDesdeFicha = await AgendamentoModel.countDocuments({
        pacienteId,
        status: "Concluído",
        $or: [
          { data: { $gt: atendimentoBase.data } },
          { data: atendimentoBase.data, horario: { $gte: atendimentoBase.horario } },
        ],
      });
    }
  }

  const atualizacaoNecessaria = Boolean(fichaAtual && consultasConcluidasDesdeFicha >= 2);
  return {
    anamneseInicial: inicial ? { _id: inicial._id } : null,
    fichaAtual: fichaAtual ? { _id: fichaAtual._id, tipo: fichaAtual.tipo } : null,
    consultasConcluidasDesdeFicha,
    atualizacaoNecessaria,
    tipoNecessario: !fichaAtual ? "inicial" : atualizacaoNecessaria ? "acompanhamento" : null,
  };
}

router.get("/pacientes/:pacienteId/anamneses/status", async (req, res) => {
  try {
    const { pacienteId } = req.params;
    if (!mongoose.isValidObjectId(pacienteId)) {
      return res.status(400).json({ erro: "Identificação do paciente inválida." });
    }

    res.json(await obterStatusAnamnese(pacienteId));
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

export async function salvarAnamneseDoAgendamento({ pacienteId, tipo, dados, agendamentoId, anamneseId }) {
  if (!mongoose.isValidObjectId(pacienteId) || !(await UserModel.exists({ _id: pacienteId }))) {
    throw new Error("Paciente não encontrado.");
  }

  const statusAnamnese = await obterStatusAnamnese(pacienteId);
  if (anamneseId) {
    const fichaAtual = await AnamneseModel.findOne({
      _id: anamneseId,
      pacienteId,
      tipo: statusAnamnese.fichaAtual?.tipo,
    });
    if (statusAnamnese.atualizacaoNecessaria || !fichaAtual || tipo !== fichaAtual.tipo) {
      throw new Error("A ficha atual precisa ser atualizada antes deste agendamento.");
    }
    if (!fichaAtual.agendamentoId) {
      fichaAtual.agendamentoId = agendamentoId;
      await fichaAtual.save();
    }
    return fichaAtual;
  }

  if (tipo !== statusAnamnese.tipoNecessario) {
    throw new Error(
      statusAnamnese.tipoNecessario === "inicial"
        ? "Preencha a ficha nutricional inicial antes do primeiro agendamento."
        : statusAnamnese.atualizacaoNecessaria
          ? "Preencha a ficha de acompanhamento antes deste agendamento."
          : "A ficha atual ainda está válida para este agendamento."
    );
  }

  if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
    throw new Error("Preencha a ficha de anamnese.");
  }

  const dadosSanitizados = Object.fromEntries(
    CAMPOS[tipo]
      .filter((campo) => Object.hasOwn(dados, campo))
      .map((campo) => [campo, Array.isArray(dados[campo])
        ? dados[campo].slice(0, 30).map((valor) => String(valor).trim().slice(0, 120))
        : String(dados[campo] ?? "").trim().slice(0, 300)])
  );
  const obrigatorios = tipo === "inicial"
    ? ["pesoKg", "alturaCm", "objetivoPrincipal", "diagnosticos", "medicamentos", "alergias", "refeicoesHabituais", "aguaLitros", "atividadeFisica", "sono"]
    : ["pesoKg", "adesaoPlano", "dificuldades", "alteracoesSaude", "sintomas", "aguaLitros", "atividadeFisica", "sono", "funcionamentoIntestinal"];

  if (obrigatorios.some((campo) => {
    return Array.isArray(dadosSanitizados[campo])
      ? dadosSanitizados[campo].length === 0
      : !dadosSanitizados[campo];
  })) {
    throw new Error("Responda todos os campos obrigatórios da ficha de anamnese.");
  }

  const peso = Number(dadosSanitizados.pesoKg);
  const altura = Number(dadosSanitizados.alturaCm);
  const cintura = Number(dadosSanitizados.medidaCinturaCm);
  if (
    !Number.isFinite(peso) || peso <= 0 ||
    (tipo === "inicial" && (!Number.isFinite(altura) || altura <= 0)) ||
    (dadosSanitizados.medidaCinturaCm && (!Number.isFinite(cintura) || cintura <= 0))
  ) {
    throw new Error("Informe peso e altura com valores maiores que zero.");
  }
  return AnamneseModel.create({ pacienteId, tipo, dados: dadosSanitizados, agendamentoId });
}

export default router;