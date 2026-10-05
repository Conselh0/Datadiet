import express from "express";
import bcrypt from "bcryptjs";
import UserModel from "../models/user.model.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: "Informe o e-mail e a senha." });
    }

    const usuario = await UserModel.findOne({
      email: email.trim().toLowerCase(),
    });

    let senhaValida = usuario && (await bcrypt.compare(senha, usuario.senha));

    // Migra senhas antigas em texto puro no primeiro login após a atualização.
    if (!senhaValida && usuario && usuario.senha === senha) {
      usuario.senha = await bcrypt.hash(senha, 12);
      await usuario.save();
      senhaValida = true;
    }

    if (!senhaValida) {
      return res.status(401).json({ erro: "E-mail ou senha inválidos." });
    }

    return res.json({
      mensagem: "Login realizado com sucesso!",
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
      },
    });
  } catch (error) {
    console.error("ERRO NO LOGIN:", error);
    return res.status(500).json({ erro: "Não foi possível realizar o login." });
  }
});

router.patch("/redefinir-senha", async (req, res) => {
  try {
    const { email, novaSenha, confirmarSenha } = req.body;

    if (!email || !novaSenha || !confirmarSenha) {
      return res.status(400).json({ erro: "Preencha todos os campos." });
    }

    if (novaSenha !== confirmarSenha) {
      return res.status(400).json({ erro: "As senhas não conferem." });
    }

    if (novaSenha.length < 8) {
      return res
        .status(400)
        .json({ erro: "A senha deve ter pelo menos 8 caracteres." });
    }

    const usuario = await UserModel.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!usuario) {
      return res
        .status(404)
        .json({ erro: "Não encontramos uma conta com este e-mail." });
    }

    usuario.senha = await bcrypt.hash(novaSenha, 12);
    await usuario.save();

    return res.json({ mensagem: "Senha redefinida com sucesso!" });
  } catch (error) {
    console.error("ERRO AO REDEFINIR SENHA:", error);
    return res
      .status(500)
      .json({ erro: "Não foi possível redefinir a senha." });
  }
});

// O ":id" na URL torna a rota dinâmica
router.get("/perfil/:id", async (req, res) => {
  try {
    const idUsuario = req.params.id; // Pega o ID enviado pela URL

    // Procura no banco de dados especificamente por esse ID
    const usuario = await UserModel.findById(idUsuario);

    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    // Retorna apenas os dados do usuário encontrado (como um objeto, não uma lista)
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro interno no servidor", error });
  }
});


router.delete("/usuarios/:id", async (req, res) => {
  try {
    const usuario = await UserModel.findByIdAndDelete(req.params.id);

    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }

    return res.json({ mensagem: "Usuário removido com sucesso!" });
  } catch {
    return res.status(400).json({ erro: "Id de usuário inválido." });
  }
});

export default router;
