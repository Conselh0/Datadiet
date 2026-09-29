import mongoose from "mongoose";

export const STATUS = ["Pendente", "Confirmado", "Concluído", "Cancelado"];

const AgendamentoSchema = new mongoose.Schema(
  {
    // Número sequencial do atendimento (18, 19, 20...)
    numero: { type: Number, unique: true },
    paciente: {
      type: String,
      required: [true, "O nome do paciente é obrigatório."],
      trim: true,
    },
    // ID do paciente logado (opcional, mas ajuda a filtrar o histórico)
    pacienteId: { type: String, index: true },
    nutricionista: {
      type: String,
      required: [true, "O nome do nutricionista é obrigatório."],
      trim: true,
    },
    // Formato "AAAA-MM-DD" (mesmo formato do <input type="date">)
    data: {
      type: String,
      required: [true, "A data da consulta é obrigatória."],
      match: [/^\d{4}-\d{2}-\d{2}$/, "Data inválida."],
    },
    // Formato "HH:MM"
    horario: {
      type: String,
      required: [true, "O horário da consulta é obrigatório."],
      match: [/^\d{2}:\d{2}$/, "Horário inválido."],
    },
    status: { type: String, enum: STATUS, default: "Pendente" },
  },
  { timestamps: true }
);

// Gera o número do atendimento automaticamente
AgendamentoSchema.pre("validate", async function (next) {
  if (this.isNew && !this.numero) {
    const ultimo = await mongoose
      .model("Agendamento")
      .findOne()
      .sort({ numero: -1 })
      .select("numero");
    this.numero = (ultimo?.numero || 0) + 1;
  }
  next();
});

const AgendamentoModel = mongoose.model("Agendamento", AgendamentoSchema);
export default AgendamentoModel;
