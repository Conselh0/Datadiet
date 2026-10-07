import express from "express";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import nodemailer from "nodemailer";
import UserModel from "../models/user.model.js";
import PasswordResetModel from "../models/password-reset.model.js";

const router = express.Router();

const TEMPO_EXPIRACAO_TOKEN_MS = 60 * 60 * 1000;

function gerarToken() {
  return crypto.randomBytes(32).toString("hex");
}

function criarHashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function criarTransportadorEmail() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
    throw new Error(
      "Configure SMTP_HOST, SMTP_PORT, SMTP_USER e SMTP_PASSWORD para enviar e-mails.",
    );
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: SMTP_USER.trim(),
      pass: SMTP_PASSWORD.replace(/\s/g, ""),
    },
  });
}

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

router.post("/redefinir-senha", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ erro: "Informe o seu e-mail." });
    }

    const usuario = await UserModel.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!usuario) {
      return res.json({
        mensagem:
          "Se existir uma conta com este e-mail, você receberá um link para escolher uma nova senha.",
      });
    }

    await PasswordResetModel.deleteMany({ usuario: usuario._id });

    const token = gerarToken();
    const reset = await PasswordResetModel.create({
      usuario: usuario._id,
      tokenHash: criarHashToken(token),
      expiraEm: new Date(Date.now() + TEMPO_EXPIRACAO_TOKEN_MS),
    });

    try {
      const transportador = criarTransportadorEmail();
      const urlAplicacao = (
        process.env.APP_URL || "http://localhost:5173"
      ).replace(/\/$/, "");
      const linkConfirmacao = `${urlAplicacao}/ConfirmarRedefinicaoSenha?token=${token}`;

      await transportador.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: usuario.email,
        subject: "Redefina sua senha - Datadiet",
        text: `Recebemos uma solicitação para redefinir sua senha. Acesse ${linkConfirmacao} para escolher uma nova senha. Este link expira em 1 hora. Se você não solicitou a alteração, ignore este e-mail.`,
        html: `
          <p>Olá, ${usuario.nome}!</p>
          <p>Recebemos uma solicitação para redefinir sua senha.</p>
          <p><a href="${linkConfirmacao}">Clique aqui para escolher uma nova senha</a></p>
          <p>Este link expira em 1 hora. Se você não solicitou a alteração, ignore este e-mail. Sua senha atual continuará funcionando.</p>
        `,
      });
    } catch (emailError) {
      await PasswordResetModel.findByIdAndDelete(reset._id);
      throw emailError;
    }

    return res.json({
      mensagem:
        "Se existir uma conta com este e-mail, você receberá um link para escolher uma nova senha.",
    });
  } catch (error) {
    console.error("ERRO AO SOLICITAR REDEFINIÇÃO DE SENHA:", error);

    if (error.message?.startsWith("Configure SMTP")) {
      return res.status(500).json({
        erro: "O envio de e-mail não está configurado. Preencha as variáveis SMTP no arquivo .env e reinicie o servidor.",
      });
    }

    return res
      .status(500)
      .json({ erro: "Não foi possível enviar o e-mail de redefinição." });
  }
});

router.post("/redefinir-senha/confirmar", async (req, res) => {
  try {
    const { token, novaSenha, confirmarSenha } = req.body;

    if (!token) {
      return res.status(400).json({ erro: "Token de redefinição ausente." });
    }

    if (!novaSenha || !confirmarSenha) {
      return res.status(400).json({ erro: "Preencha os dois campos de senha." });
    }

    if (novaSenha !== confirmarSenha) {
      return res.status(400).json({ erro: "As senhas não conferem." });
    }

    if (novaSenha.length < 8) {
      return res
        .status(400)
        .json({ erro: "A senha deve ter pelo menos 8 caracteres." });
    }

    const reset = await PasswordResetModel.findOne({
      tokenHash: criarHashToken(token),
      expiraEm: { $gt: new Date() },
    });

    if (!reset) {
      return res
        .status(400)
        .json({ erro: "O link é inválido ou expirou. Solicite uma nova redefinição." });
    }

    const usuario = await UserModel.findById(reset.usuario);

    if (!usuario) {
      await PasswordResetModel.findByIdAndDelete(reset._id);
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }

    usuario.senha = await bcrypt.hash(novaSenha, 12);
    await usuario.save();
    await PasswordResetModel.deleteMany({ usuario: usuario._id });

    return res.json({ mensagem: "Senha alterada com sucesso!" });
  } catch (error) {
    console.error("ERRO AO CONFIRMAR REDEFINIÇÃO DE SENHA:", error);
    return res
      .status(500)
      .json({ erro: "Não foi possível confirmar a alteração da senha." });
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
