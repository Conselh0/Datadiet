import mongoose from "mongoose";

const AnamneseSchema = new mongoose.Schema(
  {
    pacienteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    agendamentoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agendamento",
      default: null,
      index: true,
    },
    tipo: { type: String, enum: ["inicial", "acompanhamento"], required: true },
    dados: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true, minimize: false }
);

AnamneseSchema.index({ pacienteId: 1, tipo: 1, createdAt: -1 });

const AnamneseModel = mongoose.model("Anamnese", AnamneseSchema);
export default AnamneseModel;