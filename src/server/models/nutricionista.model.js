import mongoose from "mongoose";

const NutricionistaSchema = new mongoose.Schema(
  {
    nome: { type: String, required: [true, "O nome é obrigatório."], trim: true },
    especialidade: {
      type: String,
      required: [true, "A especialidade é obrigatória."],
      trim: true,
    },
    crn: { type: String, trim: true, default: "" },
    email: { type: String, trim: true, lowercase: true, default: "" },
    // Link da foto (opcional). Sem foto, o card mostra as iniciais.
    foto: { type: String, trim: true, default: "" },
    // Dias de atendimento: 0 = domingo ... 6 = sábado
    diasAtendimento: { type: [Number], default: [1, 2, 3, 4, 5] },
    horaInicio: { type: String, default: "08:00" },
    horaFim: { type: String, default: "17:00" },
    // Duração de cada consulta, em minutos
    duracao: { type: Number, default: 30, min: 15, max: 120 },
  },
  { timestamps: true }
);

const NutricionistaModel = mongoose.model("Nutricionista", NutricionistaSchema);
export default NutricionistaModel;
