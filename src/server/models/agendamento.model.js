import mongoose from "mongoose";

export const STATUS = ["Pendente", "Confirmado", "Concluído", "Cancelado"];

// Pedido em andamento sobre uma consulta (reagendar ou cancelar).
// "origem" diz quem pediu; quem NÃO pediu é quem precisa responder.
const SolicitacaoSchema = new mongoose.Schema(
  {
    tipo: { type: String, enum: ["Reagendamento", "Cancelamento"], required: true },
    origem: { type: String, enum: ["paciente", "nutricionista"], required: true },
    novaData: String, // só no reagendamento
    novoHorario: String, // só no reagendamento
    motivo: { type: String, trim: true, default: "" },
    criadaEm: { type: Date, default: Date.now },
  },
  { _id: false }
);

// Ficha de anamnese: uma por consulta
const AnamneseSchema = new mongoose.Schema(
  {
    pesoCorporal: String,
    altura: String,
    pesoIdeal: String,
    patologias: [String],
    patologiaOutra: String,
    historicoFamiliar: [String],
    familiarOutra: String,
    alergia: String,
    intolerancia: String,
    bebidaAlcoolica: String,
    fuma: String,
    atividadeFisica: String,
    funcionamentoIntestinal: String,
    desconfortoIntestinal: String,
    cansaco: String,
    aguaLitros: String,
    cafeDaManha: String,
    almoco: String,
    jantar: String,
    outraRefeicao: String,
  },
  { _id: false }
);

const AgendamentoSchema = new mongoose.Schema(
  {
    numero: { type: Number, unique: true },
    paciente: {
      type: String,
      required: [true, "O nome do paciente é obrigatório."],
      trim: true,
    },
    pacienteId: { type: String, index: true },
    nutricionista: {
      type: String,
      required: [true, "O nome do nutricionista é obrigatório."],
      trim: true,
    },
    nutricionistaId: { type: String, index: true },
    data: {
      type: String,
      required: [true, "A data da consulta é obrigatória."],
      match: [/^\d{4}-\d{2}-\d{2}$/, "Data inválida."],
    },
    horario: {
      type: String,
      required: [true, "O horário da consulta é obrigatório."],
      match: [/^\d{2}:\d{2}$/, "Horário inválido."],
    },
    status: { type: String, enum: STATUS, default: "Pendente" },
    solicitacao: SolicitacaoSchema,
    anamneseId: { type: mongoose.Schema.Types.ObjectId, ref: "Anamnese", default: null },
    // select:false => não sai nas listagens; só quando pedida de propósito
    anamnese: { type: AnamneseSchema, select: false },
  },
  { timestamps: true }
);

AgendamentoSchema.pre("validate", async function () {
  if (this.isNew && !this.numero) {
    const ultimo = await mongoose
      .model("Agendamento")
      .findOne()
      .sort({ numero: -1 })
      .select("numero");
    this.numero = (ultimo?.numero || 0) + 1;
  }
});

const AgendamentoModel = mongoose.model("Agendamento", AgendamentoSchema);
export default AgendamentoModel;
