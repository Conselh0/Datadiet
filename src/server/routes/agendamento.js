import express from "express";
import mongoose from "mongoose";
import AgendamentoModel, { STATUS } from "../models/agendamento.model.js";
import NutricionistaModel from "../models/nutricionista.model.js";
import UserModel from "../models/user.model.js";
import AnamneseModel from "../models/anamnese.model.js";
import { salvarAnamneseDoAgendamento } from "./anamnese.js";
import { agora, gerarHorarios, diaDaSemana } from "../../utils/horarios.js";
import { enviarEmailResend } from "../utils/email.js";

const router = express.Router();

// Consulta "em andamento": enquanto existir, o paciente não marca outra
const ATIVOS = ["Pendente", "Confirmado"];
const ORIGENS = ["paciente", "nutricionista"];

// Confere se data/horário podem ser usados com esse nutricionista.
// Devolve { nutri } se estiver tudo certo, ou { status, erro }.
async function validarSlot({ nutricionistaId, data, horario, ignorarId }) {
  if (!mongoose.isValidObjectId(nutricionistaId)) {
    return { status: 404, erro: "Nutricionista não encontrado." };
  }
  const nutri = await NutricionistaModel.findById(nutricionistaId).select("+email");
  if (!nutri) return { status: 404, erro: "Nutricionista não encontrado." };

  if (!/^\d{4}-\d{2}-\d{2}$/.test(data || "")) return { status: 400, erro: "Data inválida." };
  if (!nutri.diasAtendimento.includes(diaDaSemana(data))) {
    return { status: 400, erro: "O nutricionista não atende nesse dia." };
  }
  if (!gerarHorarios(nutri.horaInicio, nutri.horaFim, nutri.duracao).includes(horario)) {
    return { status: 400, erro: "Horário fora do atendimento do nutricionista." };
  }
  if (`${data} ${horario}` <= agora()) {
    return { status: 400, erro: "Escolha uma data e horário futuros." };
  }

  // Ocupado por outra consulta, ou reservado por um reagendamento pendente
  const filtro = {
    nutricionistaId,
    status: { $ne: "Cancelado" },
    $or: [{ data, horario }, { "solicitacao.novaData": data, "solicitacao.novoHorario": horario }],
  };
  if (ignorarId) filtro._id = { $ne: ignorarId };
  if (await AgendamentoModel.exists(filtro)) {
    return { status: 409, erro: "Este horário já está ocupado. Escolha outro." };
  }
  return { nutri };
}

const enviarErro = (res, r) => res.status(r.status).json({ erro: r.erro });

function escaparHtml(texto) {
  return String(texto).replace(/[&<>"']/g, (caractere) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[caractere]);
}

function formatarData(data) {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

function detalhesConsulta(agendamento) {
  return `Data: ${formatarData(agendamento.data)}\nHorário: ${agendamento.horario}`;
}

async function notificarParticipante(agendamento, participante, { subject, text, html }) {
  try {
    const destinatario =
      participante === "paciente"
        ? await UserModel.findById(agendamento.pacienteId).select("email")
        : await NutricionistaModel.findById(agendamento.nutricionistaId).select("+email");

    if (!destinatario?.email) {
      console.error(`EMAIL DE NOTIFICAÇÃO NÃO ENCONTRADO (${participante}).`);
      return;
    }

    await enviarEmailResend({
      to: destinatario.email,
      subject,
      text,
      html,
    });
  } catch (error) {
    console.error(`ERRO AO ENVIAR EMAIL DE NOTIFICAÇÃO (${participante}):`, error);
  }
}

async function notificarCancelamentoConsulta(agendamento, origem = "nutricionista") {
  const texto =
    origem === "nutricionista"
      ? `Sua consulta com ${agendamento.nutricionista} foi cancelada pela nutricionista.\n${detalhesConsulta(agendamento)}`
      : `Sua consulta com ${agendamento.nutricionista} foi cancelada.\n${detalhesConsulta(agendamento)}`;

  await notificarParticipante(agendamento, "paciente", {
    subject: "Consulta cancelada - Datadiet",
    text: `Olá, ${agendamento.paciente}!\n${texto}`,
    html: `<p>Olá, ${escaparHtml(agendamento.paciente)}!</p><p>Sua consulta com <strong>${escaparHtml(agendamento.nutricionista)}</strong> foi cancelada.</p><p>${escaparHtml(detalhesConsulta(agendamento)).replace("\n", "<br>")}</p>`,
  });
}

function criarMensagemSolicitacao(agendamento, participante) {
  const solicitacao = agendamento.solicitacao;
  const solicitante =
    solicitacao.origem === "paciente" ? agendamento.paciente : agendamento.nutricionista;
  const nomeDestinatario =
    participante === "paciente" ? agendamento.paciente : agendamento.nutricionista;
  const acao = solicitacao.tipo === "Cancelamento" ? "cancelamento" : "reagendamento";
  const proposta =
    solicitacao.tipo === "Reagendamento"
      ? `\nNova data proposta: ${formatarData(solicitacao.novaData)} às ${solicitacao.novoHorario}.`
      : "";
  const motivo = solicitacao.motivo ? `\nMotivo: ${solicitacao.motivo}` : "";
  const texto = `${solicitante} solicitou ${acao} da consulta.${proposta}${motivo}\nConsulta atual: ${detalhesConsulta(agendamento)}.`;
  const html = `<p>${escaparHtml(solicitante)} solicitou ${acao} da consulta.</p>${
    proposta
      ? `<p>Nova data proposta: ${escaparHtml(formatarData(solicitacao.novaData))} às ${escaparHtml(solicitacao.novoHorario)}.</p>`
      : ""
  }${
    motivo ? `<p>Motivo: ${escaparHtml(solicitacao.motivo)}</p>` : ""
  }<p>Consulta atual:<br>${escaparHtml(detalhesConsulta(agendamento)).replace("\n", "<br>")}</p><p>Acesse o Datadiet para responder.</p>`;

  return {
    subject: `Solicitação de ${acao} - Datadiet`,
    text: `Olá, ${nomeDestinatario}!\n${texto}`,
    html: `<p>Olá, ${escaparHtml(nomeDestinatario)}!</p>${html}`,
  };
}

// POST /agendamento  -> cria uma consulta (com a ficha de anamnese)
router.post("/agendamento", async (req, res) => {
  try {
    const { pacienteId, nutricionistaId, data, horario, anamnese, tipoAnamnese, anamneseId } = req.body;

    if (!pacienteId || !mongoose.isValidObjectId(pacienteId) || !(await UserModel.exists({ _id: pacienteId }))) {
      return res.status(400).json({ erro: "Não foi possível identificar o paciente." });
    }
    if (!nutricionistaId || !data || !horario) {
      return res.status(400).json({ erro: "Preencha todos os campos do agendamento." });
    }

    if ((!anamnese && !anamneseId) || !["inicial", "acompanhamento"].includes(tipoAnamnese)) {
      return res.status(400).json({ erro: "Preencha a ficha de anamnese antes de agendar." });
    }

    // Só marca outra consulta depois de concluir (ou cancelar, com aprovação) a atual
    if (await AgendamentoModel.exists({ pacienteId, status: { $in: ATIVOS } })) {
      return res.status(409).json({
        erro: "Você já tem uma consulta em andamento. Só é possível agendar outra depois que ela for concluída ou o cancelamento for confirmado.",
      });
    }

    const slot = await validarSlot({ nutricionistaId, data, horario });
    if (slot.erro) return enviarErro(res, slot);

    const usuario = await UserModel.findById(pacienteId).select("nome sobrenome email");
    const novo = await AgendamentoModel.create({
      paciente: usuario.nome,
      pacienteId,
      nutricionista: slot.nutri.nome,
      nutricionistaId,
      data,
      horario,
    });

    let ficha;
    try {
      ficha = await salvarAnamneseDoAgendamento({
        pacienteId,
        tipo: tipoAnamnese,
        dados: anamnese,
        agendamentoId: novo._id,
        anamneseId,
      });
      novo.anamneseId = ficha._id;
      await novo.save();
    } catch (errorFicha) {
      await AnamneseModel.deleteOne({ agendamentoId: novo._id });
      await AgendamentoModel.deleteOne({ _id: novo._id });
      return res.status(400).json({ erro: errorFicha.message });
    }

    let notificacoes = { paciente: false, nutricionista: false };
    try {
      const nomePaciente = escaparHtml(novo.paciente);
      const nomeNutricionista = escaparHtml(novo.nutricionista);
      const dataFormatada = formatarData(novo.data);
      const detalhes = `Data: ${dataFormatada}\nHorário: ${novo.horario}`;
      const resultados = await Promise.allSettled([
        enviarEmailResend({
          to: usuario.email,
          subject: "Consulta agendada - Datadiet",
          text: `Olá, ${novo.paciente}! Sua consulta com ${novo.nutricionista} foi agendada para ${detalhes}. A consulta está pendente de confirmação pela nutricionista.`,
          html: `<p>Olá, ${nomePaciente}!</p><p>Sua consulta com <strong>${nomeNutricionista}</strong> foi agendada.</p><p>${detalhes.replace("\n", "<br>")}</p><p>A consulta está pendente de confirmação pela nutricionista.</p>`,
        }),
        enviarEmailResend({
          to: slot.nutri.email,
          subject: "Nova consulta agendada - Datadiet",
          text: `Olá, ${slot.nutri.nome}! ${novo.paciente} agendou uma consulta para ${detalhes}. Acesse o Datadiet para consultar os detalhes.`,
          html: `<p>Olá, ${nomeNutricionista}!</p><p><strong>${nomePaciente}</strong> agendou uma nova consulta.</p><p>${detalhes.replace("\n", "<br>")}</p><p>Acesse o Datadiet para consultar os detalhes.</p>`,
        }),
      ]);
      notificacoes = {
        paciente: resultados[0].status === "fulfilled",
        nutricionista: resultados[1].status === "fulfilled",
      };
      resultados.forEach((resultado, indice) => {
        if (resultado.status === "rejected") {
          console.error(
            `ERRO AO ENVIAR EMAIL DE AGENDAMENTO (${indice === 0 ? "paciente" : "nutricionista"}):`,
            resultado.reason,
          );
        }
      });
    } catch (emailError) {
      console.error("ERRO AO CONFIGURAR EMAIL DE AGENDAMENTO:", emailError);
    }

    const emailsEnviados = notificacoes.paciente && notificacoes.nutricionista;
    res.status(201).json({
      mensagem: emailsEnviados
        ? "Consulta agendada com sucesso! Os e-mails foram enviados."
        : "Consulta agendada, mas não foi possível enviar todos os e-mails de notificação.",
      notificacoes,
      agendamento: novo,
      anamnese: ficha,
    });
  } catch (error) {
    console.error("ERRO NO AGENDAMENTO:", error);
    res.status(500).json({ erro: error.message });
  }
});

// GET /agendamentos?pacienteId=&nutricionista=&nutricionistaId=&status=
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

// GET /agendamentos/proximo?pacienteId=
router.get("/agendamentos/proximo", async (req, res) => {
  try {
    const { pacienteId } = req.query;
    if (!pacienteId) return res.status(400).json({ erro: "Informe o paciente." });

    const futuras = await AgendamentoModel.find({
      pacienteId,
      status: { $in: ATIVOS },
      data: { $gte: agora().slice(0, 10) },
    }).sort({ data: 1, horario: 1 });

    res.json(futuras.find((a) => `${a.data} ${a.horario}` >= agora()) || null);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// PATCH /agendamento/:id/status  -> confirmar, concluir ou cancelar (ação do nutricionista)
router.patch("/agendamento/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!STATUS.includes(status)) return res.status(400).json({ erro: "Status inválido." });

    const consultaAnterior = await AgendamentoModel.findById(req.params.id);
    if (!consultaAnterior) return res.status(404).json({ erro: "Consulta não encontrada." });

    const filtro = { _id: req.params.id };
    if (status === "Concluído") {
      const [ano, mes, dia] = consultaAnterior.data.split("-").map(Number);
      const [hora, minuto] = consultaAnterior.horario.split(":").map(Number);
      const dataConsulta = new Date(ano, mes - 1, dia, hora, minuto);
      const agora = new Date();
      const dataHoje = [
        agora.getFullYear(),
        String(agora.getMonth() + 1).padStart(2, "0"),
        String(agora.getDate()).padStart(2, "0"),
      ].join("-");

      if (
        consultaAnterior.status !== "Confirmado" ||
        consultaAnterior.data !== dataHoje ||
        Number.isNaN(dataConsulta.getTime()) ||
        agora.getTime() <= dataConsulta.getTime()
      ) {
        return res.status(400).json({
          erro: "A consulta só pode ser concluída no dia marcado e após o horário.",
        });
      }

      filtro.status = "Confirmado";
    }
    const atualizado = await AgendamentoModel.findOneAndUpdate(
      filtro,
      { status, $unset: { solicitacao: "" } }, // qualquer pedido pendente perde o sentido
      { new: true }
    );
    if (!atualizado) {
      return res.status(404).json({
        erro: status === "Concluído"
          ? "A consulta não está mais confirmada."
          : "Consulta não encontrada.",
      });
    }
    if (consultaAnterior.status !== atualizado.status) {
      const texto = `O status da sua consulta com ${atualizado.nutricionista} foi alterado de ${consultaAnterior.status} para ${atualizado.status}.\n${detalhesConsulta(atualizado)}`;
      if (atualizado.status === "Cancelado") {
        await notificarCancelamentoConsulta(atualizado, "nutricionista");
      } else {
        await notificarParticipante(atualizado, "paciente", {
          subject: `Status da consulta: ${atualizado.status} - Datadiet`,
          text: `Olá, ${atualizado.paciente}!\n${texto}`,
          html: `<p>Olá, ${escaparHtml(atualizado.paciente)}!</p><p>O status da sua consulta com <strong>${escaparHtml(atualizado.nutricionista)}</strong> foi alterado de <strong>${escaparHtml(consultaAnterior.status)}</strong> para <strong>${escaparHtml(atualizado.status)}</strong>.</p><p>${escaparHtml(detalhesConsulta(atualizado)).replace("\n", "<br>")}</p>`,
        });
      }
    }
    res.json(atualizado);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// POST /agendamento/:id/solicitacao
// body: { tipo: "Reagendamento"|"Cancelamento", origem, novaData?, novoHorario?, motivo? }
//  - paciente pede reagendamento ou cancelamento  -> o nutricionista responde
//  - nutricionista propõe reagendamento           -> o paciente responde
router.post("/agendamento/:id/solicitacao", async (req, res) => {
  try {
    const { tipo, origem, novaData, novoHorario, motivo } = req.body;

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ erro: "Consulta não encontrada." });
    }
    const ag = await AgendamentoModel.findById(req.params.id);
    if (!ag) return res.status(404).json({ erro: "Consulta não encontrada." });

    if (!ORIGENS.includes(origem)) return res.status(400).json({ erro: "Origem inválida." });
    if (!["Reagendamento", "Cancelamento"].includes(tipo)) {
      return res.status(400).json({ erro: "Tipo de solicitação inválido." });
    }
    if (origem === "nutricionista" && tipo !== "Reagendamento") {
      return res.status(400).json({ erro: "O nutricionista cancela a consulta diretamente." });
    }
    if (!ATIVOS.includes(ag.status)) {
      return res.status(400).json({ erro: "Esta consulta não pode mais ser alterada." });
    }
    if (ag.solicitacao) {
      return res.status(409).json({ erro: "Já existe uma solicitação em andamento nesta consulta." });
    }

    const nova = { tipo, origem, motivo: (motivo || "").trim().slice(0, 300) };

    if (tipo === "Reagendamento") {
      if (novaData === ag.data && novoHorario === ag.horario) {
        return res.status(400).json({ erro: "Escolha uma data ou horário diferente do atual." });
      }
      const slot = await validarSlot({
        nutricionistaId: ag.nutricionistaId,
        data: novaData,
        horario: novoHorario,
        ignorarId: ag._id,
      });
      if (slot.erro) return enviarErro(res, slot);
      nova.novaData = novaData;
      nova.novoHorario = novoHorario;
    }

    ag.solicitacao = nova;
    await ag.save();

    const destinatario = origem === "paciente" ? "nutricionista" : "paciente";
    const mensagem = criarMensagemSolicitacao(ag, destinatario);
    await notificarParticipante(ag, destinatario, mensagem);

    res.status(201).json({
      mensagem:
        origem === "paciente"
          ? "Solicitação enviada. Aguarde a resposta do nutricionista."
          : "Proposta enviada. Aguarde a confirmação do paciente.",
      agendamento: ag,
    });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// POST /agendamento/:id/solicitacao/responder   body: { por, aceitar }
// Quem responde é sempre o lado que NÃO fez o pedido.
router.post("/agendamento/:id/solicitacao/responder", async (req, res) => {
  try {
    const { por, aceitar } = req.body;
    if (!ORIGENS.includes(por)) return res.status(400).json({ erro: "Origem inválida." });
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ erro: "Consulta não encontrada." });
    }

    const ag = await AgendamentoModel.findById(req.params.id);
    if (!ag) return res.status(404).json({ erro: "Consulta não encontrada." });
    if (!ag.solicitacao) return res.status(404).json({ erro: "Não há solicitação pendente." });

    const { tipo, origem, novaData, novoHorario } = ag.solicitacao;
    if (origem === por) {
      return res.status(400).json({ erro: "Você não pode responder ao seu próprio pedido." });
    }

    if (!aceitar) {
      ag.solicitacao = undefined;
      await ag.save();
      const destinatario = origem;
      const papelSolicitante = origem === "paciente" ? "paciente" : "nutricionista";
      const mensagem = `Sua solicitação de ${tipo.toLowerCase()} foi recusada. A consulta permanece em ${formatarData(ag.data)} às ${ag.horario}.`;
      await notificarParticipante(ag, destinatario, {
        subject: `Solicitação recusada - Datadiet`,
        text: `Olá, ${papelSolicitante === "paciente" ? ag.paciente : ag.nutricionista}!\n${mensagem}`,
        html: `<p>Olá, ${escaparHtml(papelSolicitante === "paciente" ? ag.paciente : ag.nutricionista)}!</p><p>${escaparHtml(mensagem)}</p>`,
      });
      return res.json({ mensagem: "Solicitação recusada.", agendamento: ag });
    }

    if (tipo === "Cancelamento") {
      ag.status = "Cancelado"; // libera o paciente para marcar outra consulta
    } else {
      const slot = await validarSlot({
        nutricionistaId: ag.nutricionistaId,
        data: novaData,
        horario: novoHorario,
        ignorarId: ag._id,
      });
      if (slot.erro) return enviarErro(res, slot);
      ag.data = novaData;
      ag.horario = novoHorario;
      ag.status = "Confirmado";
      ag.lembrete24hEnviadoEm = undefined;
      ag.lembrete2hEnviadoEm = undefined;
      ag.lembrete24hEmProcessamentoEm = undefined;
      ag.lembrete2hEmProcessamentoEm = undefined;
    }
    ag.solicitacao = undefined;
    await ag.save();

    const destinatario = origem;
    const nomeDestinatario = origem === "paciente" ? ag.paciente : ag.nutricionista;
    const texto =
      tipo === "Cancelamento"
        ? "O cancelamento da consulta foi confirmado."
        : `O reagendamento foi confirmado para ${formatarData(ag.data)} às ${ag.horario}.`;
    await notificarParticipante(ag, destinatario, {
      subject: `${tipo} confirmado - Datadiet`,
      text: `Olá, ${nomeDestinatario}!\n${texto}`,
      html: `<p>Olá, ${escaparHtml(nomeDestinatario)}!</p><p>${escaparHtml(texto)}</p>`,
    });

    res.json({
      mensagem: tipo === "Cancelamento" ? "Cancelamento confirmado." : "Reagendamento confirmado.",
      agendamento: ag,
    });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// DELETE /agendamento/:id/solicitacao?por=paciente|nutricionista
// Quem fez o pedido pode retirá-lo.
router.delete("/agendamento/:id/solicitacao", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ erro: "Consulta não encontrada." });
    }
    const ag = await AgendamentoModel.findById(req.params.id);
    if (!ag?.solicitacao) return res.status(404).json({ erro: "Não há solicitação pendente." });
    if (ag.solicitacao.origem !== req.query.por) {
      return res.status(400).json({ erro: "Só quem fez o pedido pode retirá-lo." });
    }
    const solicitacaoRetirada = ag.solicitacao;
    ag.solicitacao = undefined;
    await ag.save();
    const destinatario = solicitacaoRetirada.origem === "paciente" ? "nutricionista" : "paciente";
    const solicitante =
      solicitacaoRetirada.origem === "paciente" ? ag.paciente : ag.nutricionista;
    const mensagem = `A solicitação de ${solicitacaoRetirada.tipo.toLowerCase()} feita por ${solicitante} foi retirada.`;
    await notificarParticipante(ag, destinatario, {
      subject: "Solicitação retirada - Datadiet",
      text: mensagem,
      html: `<p>${escaparHtml(mensagem)}</p>`,
    });
    res.json({ mensagem: "Solicitação retirada.", agendamento: ag });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

export default router;
