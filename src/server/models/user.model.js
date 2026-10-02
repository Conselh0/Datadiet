//importanto o mongoose
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    minlength: 2,
  },
  sobrenome: {
    type: String,
    required: true,
  },
  nascimento: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  senha: {
    type: String,
    required: true,
  },
  cpf: {
    type: String, //Trata-se de uma regra usar string para código identificador
    required: true,
    unique: true,
    minlength: 11,
    maxlength: 11,
    match: /^\d{11}$/, //Garante que somente números sejam digitados
  },
  telefone: {
    type: String,
    required: true,
    unique: true,
  },
  genero: {
    type: String,
    required: true,
    lowercase: true,
    enum: ["masculino", "feminino", "outro"]
  },
});

//Convenção começar com letra maiúscula
const UserModel = mongoose.model("User", userSchema);

export default UserModel;