import mongoose from "mongoose";

export const STATUS = ["Pendente", "Confirmado", "Concluído", "Cancelado"];

const AgendamentoSchema = new mongoose.Schema(
  {
    numero: { type: Number, unique: true },
    paciente: {
      type: String,
      required: [true, "O nome do paciente é obrigatório."],
      trim: true,
    },
    pacienteId: { type: String, index: true },
    // Nome (para exibir) e ID (para buscar) do nutricionista
    nutricionista: {
      type: String,
      required: [true, "O nome do nutricionista é obrigatório."],
      trim: true,
    },
    nutricionistaId: { type: String, index: true },
    // "AAAA-MM-DD"
    data: {
      type: String,
      required: [true, "A data da consulta é obrigatória."],
      match: [/^\d{4}-\d{2}-\d{2}$/, "Data inválida."],
    },
    // "HH:MM"
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
