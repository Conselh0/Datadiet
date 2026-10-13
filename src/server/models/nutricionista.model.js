import mongoose from "mongoose";

const NutricionistaSchema = new mongoose.Schema(
  {
    // Nome completo (nome + sobrenome): é o que aparece no card e nas consultas
    nome: { type: String, required: [true, "O nome é obrigatório."], trim: true },
    especialidade: {
      type: String,
      required: [true, "A especialidade é obrigatória."],
      trim: true,
    },
    crn: { type: String, trim: true, default: "" },
    foto: { type: String, trim: true, default: "" },
    genero: { type: String, trim: true, default: "" },

    // Dados pessoais e de acesso: select:false => NÃO saem nas listagens públicas
    email: { type: String, trim: true, lowercase: true, select: false },
    cpf: { type: String, select: false },
    telefone: { type: String, select: false },
    nascimento: { type: String, select: false }, // "AAAA-MM-DD"
    senha: { type: String, select: false }, // "salt:hash"

    // Agenda: 0 = domingo ... 6 = sábado
    diasAtendimento: { type: [Number], default: [1, 2, 3, 4, 5] },
    horaInicio: { type: String, default: "08:00" },
    horaFim: { type: String, default: "17:00" },
    duracao: { type: Number, default: 30, min: 15, max: 120 },
  },
  { timestamps: true }
);

const NutricionistaModel = mongoose.model("Nutricionista", NutricionistaSchema);
export default NutricionistaModel;
