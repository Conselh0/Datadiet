import AgendamentoModel from "../models/agendamento.model.js";
import UserModel from "../models/user.model.js";
import { enviarEmailResend } from "../utils/email.js";
import { agora } from "../../utils/horarios.js";

const INTERVALO_VERIFICACAO_MS = 60 * 1000;
const JANELA_ENVIO_MS = 15 * 60 * 1000;
const TEMPO_TRAVA_MS = 3 * 60 * 1000;
const STATUS_ATIVOS = ["Pendente", "Confirmado"];
const LEMBRETES = [
  {
    horas: 24,
    minutosAntes: 24 * 60,
    campoEnviado: "lembrete24hEnviadoEm",
    campoTrava: "lembrete24hEmProcessamentoEm",
    assunto: "Lembrete: sua consulta será em aproximadamente 24 horas - Datadiet",
    texto: (agendamento) =>
      `Olá, ${agendamento.paciente}! Este é um lembrete de que sua consulta com ${agendamento.nutricionista} está marcada para ${formatarData(agendamento.data)}, às ${agendamento.horario}.`,
  },
  {
    horas: 2,
    minutosAntes: 2 * 60,
    campoEnviado: "lembrete2hEnviadoEm",
    campoTrava: "lembrete2hEmProcessamentoEm",
    assunto: "Lembrete: sua consulta é em 2 horas - Datadiet",
    texto: (agendamento) =>
      `Olá, ${agendamento.paciente}! Sua consulta com ${agendamento.nutricionista} está marcada para daqui a aproximadamente 2 horas, hoje às ${agendamento.horario}.`,
  },
];

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

function instanteConsulta(agendamento) {
  // As datas dos agendamentos são registradas no horário de São Paulo (UTC-3).
  return new Date(`${agendamento.data}T${agendamento.horario}:00-03:00`);
}

function intervaloDatasConsulta() {
  const hoje = agora().slice(0, 10);
  const [ano, mes, dia] = hoje.split("-").map(Number);
  const limite = new Date(Date.UTC(ano, mes - 1, dia + 2));
  const dataLimite = [
    limite.getUTCFullYear(),
    String(limite.getUTCMonth() + 1).padStart(2, "0"),
    String(limite.getUTCDate()).padStart(2, "0"),
  ].join("-");

  return { hoje, dataLimite };
}

async function enviarLembrete(agendamento, lembrete, agoraMs) {
  const consultaEm = instanteConsulta(agendamento);
  const consultaEmMs = consultaEm.getTime();
  if (!Number.isFinite(consultaEmMs) || consultaEmMs <= agoraMs) return;

  const envioPrevistoEm = consultaEmMs - lembrete.minutosAntes * 60 * 1000;
  const atrasoMs = agoraMs - envioPrevistoEm;
  if (atrasoMs < 0 || atrasoMs > JANELA_ENVIO_MS) return;

  const criadoEmMs = agendamento.createdAt?.getTime();
  if (criadoEmMs && criadoEmMs > envioPrevistoEm) return;

  const agoraDate = new Date(agoraMs);
  const travaExpiradaAntesDe = new Date(agoraMs - TEMPO_TRAVA_MS);
  const consultaTravada = await AgendamentoModel.findOneAndUpdate(
    {
      _id: agendamento._id,
      data: agendamento.data,
      horario: agendamento.horario,
      status: { $in: STATUS_ATIVOS },
      [lembrete.campoEnviado]: { $exists: false },
      $or: [
        { [lembrete.campoTrava]: { $exists: false } },
        { [lembrete.campoTrava]: { $lt: travaExpiradaAntesDe } },
      ],
    },
    { $set: { [lembrete.campoTrava]: agoraDate } },
    { new: true },
  );

  if (!consultaTravada) return;

  try {
    const paciente = await UserModel.findById(consultaTravada.pacienteId).select("email");
    if (!paciente?.email) {
      throw new Error(`E-mail do paciente não encontrado para consulta ${consultaTravada._id}.`);
    }

    const texto = lembrete.texto(consultaTravada);
    const situacao =
      consultaTravada.status === "Pendente"
        ? " O agendamento ainda aguarda confirmação da nutricionista."
        : "";
    const textoCompleto = `${texto}${situacao}\n\nAcesse o Datadiet para consultar os detalhes.`;

    await enviarEmailResend({
      to: paciente.email,
      subject: lembrete.assunto,
      text: textoCompleto,
      html: `<p>${escaparHtml(texto)}</p>${situacao ? `<p>${escaparHtml(situacao.trim())}</p>` : ""}<p>Acesse o Datadiet para consultar os detalhes.</p>`,
    });

    const resultado = await AgendamentoModel.updateOne(
      { _id: consultaTravada._id, [lembrete.campoTrava]: agoraDate },
      {
        $set: { [lembrete.campoEnviado]: new Date() },
        $unset: { [lembrete.campoTrava]: "" },
      },
    );

    if (!resultado.modifiedCount) {
      console.error(
        `EMAIL DE LEMBRETE ENVIADO, MAS NÃO FOI POSSÍVEL REGISTRAR O ENVIO (${consultaTravada._id}, ${lembrete.horas}h).`,
      );
    }
  } catch (error) {
    console.error(
      `ERRO AO ENVIAR LEMBRETE DE ${lembrete.horas}H (${consultaTravada._id}):`,
      error,
    );
  }
}

async function verificarLembretes() {
  const { hoje, dataLimite } = intervaloDatasConsulta();
  const agendamentos = await AgendamentoModel.find({
    status: { $in: STATUS_ATIVOS },
    data: { $gte: hoje, $lte: dataLimite },
  }).select(
    "paciente pacienteId nutricionista data horario status createdAt lembrete24hEnviadoEm lembrete2hEnviadoEm",
  );

  const agoraMs = Date.now();
  for (const agendamento of agendamentos) {
    for (const lembrete of LEMBRETES) {
      await enviarLembrete(agendamento, lembrete, agoraMs);
    }
  }
}

export function iniciarLembretesAgendamento() {
  let verificacaoEmAndamento = false;

  const executarVerificacao = async () => {
    if (verificacaoEmAndamento) return;
    verificacaoEmAndamento = true;
    try {
      await verificarLembretes();
    } catch (error) {
      console.error("ERRO AO VERIFICAR LEMBRETES DE CONSULTAS:", error);
    } finally {
      verificacaoEmAndamento = false;
    }
  };

  void executarVerificacao();
  return setInterval(executarVerificacao, INTERVALO_VERIFICACAO_MS);
}
