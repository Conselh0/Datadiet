//importanto o mongoose
import mongoose from "mongoose";

//Criando a classe para que possamos criar o usuário no banco de dados
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
    type: String,
    required: true,
    unique: true,
  },
  telefone: {
    type: String,
    required: true,
    unique: true,
  },
  genero: {
    type: String,
    required: true,
    enum: ["Masculino", "Feminino", "Outro"],
  },
});

//Convenção começar com letra maiúscula
const UserModel = mongoose.model("User", userSchema);

export default UserModel;
