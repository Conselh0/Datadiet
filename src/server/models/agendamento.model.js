import mongoose from "mongoose";

// Definindo a estrutura da tabela (Schema) de agendamentos
const AgendamentoSchema = new mongoose.Schema(
  {
    nutricionista: {
      type: String,
      required: [true, "O nome do nutricionista é obrigatório."],
    },
    data: {
      type: String,
      required: [true, "A data da consulta é obrigatória."],
    },
    horario: {
      type: String,
      required: [true, "O horário da consulta é obrigatório."],
    },
  },
  { 
    // Cria automaticamente os campos de 'createdAt' e 'updatedAt' no banco (muito útil!)
    timestamps: true, 
  }
);

// Criando o modelo baseado no Schema
// O MongoDB Atlas vai criar uma coleção chamada "agendamentos" automaticamente no plural
const AgendamentoModel = mongoose.model("Agendamento", AgendamentoSchema);

export default AgendamentoModel;