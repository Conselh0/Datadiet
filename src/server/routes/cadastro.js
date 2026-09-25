import express from "express";
import cors from "cors";
import UserModel from "../models/user.model.js";

const app = express();
app.use(cors()); //middleware para sempre usarmos o cors
app.use(express.json()); // vai ler o vody do post/put

//Cadastro do paciente
app.post("/cadastro", async (req, res) => {
  try {
    const {
      nome,
      sobrenome,
      nascimento,
      email,
      senha,
      confirmarSenha,
      cpf,
      telefone,
      genero,
    } = req.body; //Requere as variáveis que foram enviadas pelo CadPa

    //Obriga o preenchimento de todos os campos
    if (
      !nome ||
      !sobrenome ||
      !email ||
      !senha ||
      !nascimento ||
      !cpf ||
      !telefone ||
      !genero
    ) {
      return res
        .status(400)
        .json({ erro: "Preencha todos os campos obrigatórios." });
    }

    //Validação do campo da senha
    if (confirmarSenha !== senha) {
      return res.status(400).send({ erro: "as senhas não conferem." });
    }

    //PRINCIPAL = Salva os usuários no banco
    const user = await UserModel.create({
      nome,
      sobrenome,
      nascimento,
      email,
      senha,
      confirmarSenha,
      cpf,
      telefone,
      genero,
    });
    res.status(201).json({ mensagem: "Cadastro realizado!" });
  } catch (error) {
    console.error("ERRO NO CADASTRO:", error);
    return res.status(500).json({ erro: error.message });
  }
});

export default app;
