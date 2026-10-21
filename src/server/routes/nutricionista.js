import express from "express";
import mongoose from "mongoose";
import NutricionistaModel from "../models/nutricionista.model.js";
import AgendamentoModel from "../models/agendamento.model.js";
import AnamneseModel from "../models/anamnese.model.js";
import UserModel from "../models/user.model.js";
import { agora, gerarHorarios, diaDaSemana } from "../../utils/horarios.js";
import { hashSenha, verificarSenha } from "../../utils/senha.js";

const router = express.Router();

const GENEROS = ["Feminino", "Masculino", "Outro", "Prefiro não responder"];
const TIPOS_MIME_IMAGEM = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
];
const TAMANHO_MAXIMO_FOTO_BYTES = 2 * 1024 * 1024;

function cpfValido(cpf) {
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  for (let t = 9; t < 11; t++) {
    let soma = 0;
    for (let i = 0; i < t; i++) soma += Number(cpf[i]) * (t + 1 - i);
    if (((soma * 10) % 11) % 10 !== Number(cpf[t])) return false;
  }
  return true;
}

function maiorDeIdade(iso) {
  const nasc = new Date(`${iso}T12:00:00`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso) || isNaN(nasc)) return null;
  const hoje = new Date();
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
  return idade >= 18;
}

// POST /nutricionista  -> cria a conta do nutricionista
router.post("/nutricionista", async (req, res) => {
  try {
    const b = req.body;
    const nome = (b.nome || "").trim();
    const sobrenome = (b.sobrenome || "").trim();
    const email = (b.email || "").trim().toLowerCase();
    const cpf = (b.cpf || "").replace(/\D/g, "");
    const telefone = (b.telefone || "").replace(/\D/g, "");
    const crn = (b.crn || "").trim();
    const { senha, confirmarSenha, nascimento, genero, especialidade, foto, diasAtendimento, horaInicio, horaFim, duracao } = b;

    const erro = (msg) => res.status(400).json({ erro: msg });

    if (!nome || !sobrenome) return erro("Informe nome e sobrenome.");
    if (!especialidade) return erro("Selecione a especialização.");
    if (!GENEROS.includes(genero)) return erro("Selecione o gênero.");
    if (!crn) return erro("Informe o CRN.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return erro("E-mail inválido.");
    if (!senha || senha.length < 6) return erro("A senha deve ter ao menos 6 caracteres.");
    if (senha !== confirmarSenha) return erro("As senhas não conferem.");
    if (!cpfValido(cpf)) return erro("CPF inválido.");
    if (telefone.length < 10 || telefone.length > 11) return erro("Telefone inválido.");

    const adulto = maiorDeIdade(nascimento);
    if (adulto === null) return erro("Data de nascimento inválida.");
    if (!adulto) return erro("É necessário ter 18 anos ou mais.");

    if (
      !Array.isArray(diasAtendimento) ||
      diasAtendimento.length === 0 ||
      !diasAtendimento.every((d) => Number.isInteger(d) && d >= 0 && d <= 6)
    ) {
      return erro("Escolha ao menos um dia de atendimento.");
    }
    if (!horaInicio || !horaFim || horaInicio >= horaFim) {
      return erro("O horário final deve ser depois do inicial.");
    }

    // Evita duplicidade
    if (await NutricionistaModel.exists({ email })) {
      return res.status(409).json({ erro: "Já existe uma conta com este e-mail." });
    }
    if (await NutricionistaModel.exists({ cpf })) {
      return res.status(409).json({ erro: "Já existe uma conta com este CPF." });
    }
    if (await NutricionistaModel.exists({ crn })) {
      return res.status(409).json({ erro: "Já existe uma conta com este CRN." });
    }

    const nova = await NutricionistaModel.create({
      nome: `${nome} ${sobrenome}`,
      especialidade,
      crn,
      foto,
      genero,
      email,
      cpf,
      telefone,
      nascimento,
      senha: hashSenha(senha),
      diasAtendimento,
      horaInicio,
      horaFim,
      duracao: Number(duracao) || 30,
    });

    res.status(201).json({
      mensagem: "Conta criada com sucesso!",
      nutricionista: { id: nova._id, nome: nova.nome },
    });
  } catch (error) {
    console.error("ERRO NO CADASTRO DO NUTRICIONISTA:", error);
    res.status(500).json({ erro: error.message });
  }
});

// GET /nutricionistas/:id/pacientes
// -> pacientes que já agendaram com este nutricionista (a partir das consultas)
router.get("/nutricionistas/:id/pacientes", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ erro: "Nutricionista não encontrado." });
    }

    const consultas = await AgendamentoModel.find({
      nutricionistaId: id,
      pacienteId: { $nin: [null, ""] },
      status: { $ne: "Cancelado" },
    }).sort({ data: 1, horario: 1 });

    const agoraTexto = agora();
    const mapa = new Map();
    const pacientesCadastrados = await UserModel.find({
    _id: { $in: [...new Set(consultas.map((consulta) => consulta.pacienteId))] },
    }).select("nome sobrenome nascimento email telefone genero fotoPerfil");
    const dadosPorId = new Map(
    pacientesCadastrados.map((paciente) => [String(paciente._id), paciente]),
    );

    for (const a of consultas) {
    const dadosPaciente = dadosPorId.get(String(a.pacienteId));
    const p = mapa.get(a.pacienteId) || {
      pacienteId: a.pacienteId,
      paciente: a.paciente,
      nome: dadosPaciente?.nome || a.paciente,
      sobrenome: dadosPaciente?.sobrenome || "",
      nascimento: dadosPaciente?.nascimento || null,
      email: dadosPaciente?.email || "",
      telefone: dadosPaciente?.telefone || "",
      genero: dadosPaciente?.genero || "",
      fotoPerfil: dadosPaciente?.fotoPerfil || "",
      total: 0,
      ultima: null,
      proxima: null,
    };
      p.paciente = a.paciente;
      p.total++;

      // Ordenadas da mais antiga para a mais nova: a última "Concluído" vence
      if (a.status === "Concluído") {
        p.ultima = { data: a.data, horario: a.horario };
      } else if (!p.proxima && `${a.data} ${a.horario}` >= agoraTexto) {
        p.proxima = { data: a.data, horario: a.horario };
      }
      mapa.set(a.pacienteId, p);
    }

    res.json([...mapa.values()].sort((x, y) => x.paciente.localeCompare(y.paciente)));
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// GET /nutricionistas/:id/pacientes/:pacienteId/anamneses
// -> fichas de anamnese do paciente (uma por consulta), da mais nova para a mais antiga
router.get("/nutricionistas/:id/pacientes/:pacienteId/anamneses", async (req, res) => {
  try {
    const { id, pacienteId } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ erro: "Nutricionista não encontrado." });
    }

    const consultas = await AgendamentoModel.find({
      nutricionistaId: id,
      pacienteId,
    })
      .select("+anamnese")
      .sort({ data: -1, horario: -1 });

    const fichasNovas = await AnamneseModel.find({
      _id: { $in: consultas.map((a) => a.anamneseId).filter(Boolean) },
    });
    const porId = new Map(fichasNovas.map((f) => [String(f._id), f]));

    res.json(
      consultas.filter((a) => a.anamnese || porId.has(String(a.anamneseId))).map((a) => ({
        _id: a._id,
        numero: a.numero,
        data: a.data,
        horario: a.horario,
        status: a.status,
        anamnese: a.anamnese || porId.get(String(a.anamneseId))?.dados,
        tipoAnamnese: porId.get(String(a.anamneseId))?.tipo || "legada",
      }))
    );
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// POST /login/nutricionista  -> login do nutricionista
router.post("/login/nutricionista", async (req, res) => {
  try {
    const email = (req.body.email || "").trim().toLowerCase();
    const senha = req.body.senha || "";
    if (!email || !senha) {
      return res.status(400).json({ erro: "Informe e-mail e senha." });
    }

    const nutri = await NutricionistaModel.findOne({ email }).select("+senha");
    if (!nutri || !verificarSenha(senha, nutri.senha)) {
      return res.status(401).json({ erro: "E-mail ou senha inválidos." });
    }

    res.json({
      nutricionista: {
        id: nutri._id,
        nome: nutri.nome,
        foto: nutri.foto || "",
      },
    });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// GET /nutricionista/:id  -> perfil para a home do próprio nutricionista
// (inclui e-mail, telefone e nascimento; nunca CPF nem senha)
router.get("/nutricionista/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ erro: "Nutricionista não encontrado." });
    }
    const nutri = await NutricionistaModel.findById(req.params.id).select(
      "+email +telefone +nascimento"
    );
    if (!nutri) return res.status(404).json({ erro: "Nutricionista não encontrado." });
    res.json(nutri);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// PATCH /nutricionista/:id -> atualiza perfil, agenda e, opcionalmente, senha
router.patch("/nutricionista/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ erro: "Nutricionista não encontrado." });
    }

    const {
      nome,
      email,
      crn,
      especialidade,
      foto,
      genero,
      nascimento,
      telefone,
      diasAtendimento,
      horaInicio,
      horaFim,
      duracao,
      senhaAtual,
      novaSenha,
      confirmarNovaSenha,
    } = req.body;

    const erro = (mensagem) => res.status(400).json({ erro: mensagem });
    const nomeNormalizado = typeof nome === "string" ? nome.trim() : "";
    const emailNormalizado =
      typeof email === "string" ? email.trim().toLowerCase() : "";
    const crnNormalizado = typeof crn === "string" ? crn.trim() : "";
    const telefoneNormalizado =
      typeof telefone === "string" ? telefone.replace(/\D/g, "") : "";
    const fotoNormalizada = typeof foto === "string" ? foto.trim() : "";

    if (!nomeNormalizado) return erro("Informe o nome completo.");
    if (!/^\S+@\S+\.\S+$/.test(emailNormalizado)) return erro("E-mail inválido.");
    if (!GENEROS.includes(genero)) return erro("Selecione o gênero.");
    if (typeof especialidade !== "string" || !especialidade.trim()) {
      return erro("Selecione a especialização.");
    }
    if (!crnNormalizado) return erro("Informe o CRN.");

    const adulto = maiorDeIdade(nascimento);
    if (adulto === null) return erro("Data de nascimento inválida.");
    if (!adulto) return erro("É necessário ter 18 anos ou mais.");

    if (
      !Array.isArray(diasAtendimento) ||
      diasAtendimento.length === 0 ||
      new Set(diasAtendimento).size !== diasAtendimento.length ||
      !diasAtendimento.every((dia) => Number.isInteger(dia) && dia >= 0 && dia <= 6)
    ) {
      return erro("Escolha ao menos um dia de atendimento.");
    }
    if (
      !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(horaInicio || "") ||
      !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(horaFim || "") ||
      horaInicio >= horaFim
    ) {
      return erro("O horário final deve ser depois do inicial.");
    }

    const duracaoNumerica = Number(duracao);
    if (
      !Number.isInteger(duracaoNumerica) ||
      duracaoNumerica < 15 ||
      duracaoNumerica > 120
    ) {
      return erro("A duração deve ser entre 15 e 120 minutos.");
    }
    if (telefoneNormalizado && ![10, 11].includes(telefoneNormalizado.length)) {
      return erro("Telefone inválido.");
    }
    if (fotoNormalizada.startsWith("data:")) {
      const imagem = /^data:(image\/[a-z0-9.+-]+);base64,([a-z0-9+/=]+)$/i.exec(
        fotoNormalizada,
      );
      if (!imagem || !TIPOS_MIME_IMAGEM.includes(imagem[1].toLowerCase())) {
        return erro("Formato de imagem não suportado.");
      }
      if (Buffer.from(imagem[2], "base64").length > TAMANHO_MAXIMO_FOTO_BYTES) {
        return erro("A imagem deve ter no máximo 2 MB.");
      }
    } else if (
      fotoNormalizada &&
      (fotoNormalizada.length > 2048 ||
        !/^https?:\/\/\S+$/i.test(fotoNormalizada))
    ) {
      return erro("Informe uma URL de imagem válida.");
    }

    if (
      await NutricionistaModel.exists({
        email: emailNormalizado,
        _id: { $ne: id },
      })
    ) {
      return res.status(409).json({ erro: "Já existe uma conta com este e-mail." });
    }
    if (
      crnNormalizado &&
      (await NutricionistaModel.exists({
        crn: crnNormalizado,
        _id: { $ne: id },
      }))
    ) {
      return res.status(409).json({ erro: "Já existe uma conta com este CRN." });
    }

    const alterandoSenha = Boolean(senhaAtual || novaSenha || confirmarNovaSenha);
    const nutricionista = await NutricionistaModel.findById(id).select("+senha");
    if (!nutricionista) {
      return res.status(404).json({ erro: "Nutricionista não encontrado." });
    }

    if (alterandoSenha) {
      if (!senhaAtual || !novaSenha || !confirmarNovaSenha) {
        return erro("Informe a senha atual e preencha os dois campos da nova senha.");
      }
      if (!verificarSenha(senhaAtual, nutricionista.senha)) {
        return res.status(401).json({ erro: "A senha atual está incorreta." });
      }
      if (novaSenha.length < 6) {
        return erro("A nova senha deve ter ao menos 6 caracteres.");
      }
      if (novaSenha !== confirmarNovaSenha) {
        return erro("A confirmação da nova senha não confere.");
      }
      nutricionista.senha = hashSenha(novaSenha);
    }

    nutricionista.nome = nomeNormalizado;
    nutricionista.email = emailNormalizado;
    nutricionista.crn = crnNormalizado;
    nutricionista.especialidade = especialidade.trim();
    nutricionista.foto = fotoNormalizada;
    nutricionista.genero = genero;
    nutricionista.nascimento = nascimento;
    nutricionista.telefone = telefoneNormalizado;
    nutricionista.diasAtendimento = diasAtendimento;
    nutricionista.horaInicio = horaInicio;
    nutricionista.horaFim = horaFim;
    nutricionista.duracao = duracaoNumerica;
    await nutricionista.save();

    const dadosNutricionista = nutricionista.toObject();
    delete dadosNutricionista.senha;
    delete dadosNutricionista.cpf;
    res.json({
      mensagem: "Perfil atualizado com sucesso.",
      nutricionista: dadosNutricionista,
    });
  } catch (error) {
    console.error("ERRO AO ATUALIZAR PERFIL DO NUTRICIONISTA:", error);
    res.status(500).json({ erro: error.message });
  }
});

// GET /nutricionistas  -> lista pública (cards). Sem CPF, e-mail, telefone ou senha.
router.get("/nutricionistas", async (req, res) => {
  try {
    res.json(await NutricionistaModel.find().sort({ nome: 1 }));
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// GET /nutricionistas/:id/horarios?data=AAAA-MM-DD
router.get("/nutricionistas/:id/horarios", async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = req.query;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ erro: "Nutricionista não encontrado." });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data || "")) {
      return res.status(400).json({ erro: "Data inválida." });
    }

    const nutri = await NutricionistaModel.findById(id);
    if (!nutri) return res.status(404).json({ erro: "Nutricionista não encontrado." });

    if (!nutri.diasAtendimento.includes(diaDaSemana(data))) return res.json([]);

    // Tomados: consultas marcadas + horários propostos em reagendamentos pendentes
    const consultas = await AgendamentoModel.find({
      nutricionistaId: id,
      status: { $ne: "Cancelado" },
      $or: [{ data }, { "solicitacao.novaData": data }],
    });
    const tomados = new Set();
    for (const a of consultas) {
      if (a.data === data) tomados.add(a.horario);
      if (a.solicitacao?.novaData === data) tomados.add(a.solicitacao.novoHorario);
    }

    res.json(
      gerarHorarios(nutri.horaInicio, nutri.horaFim, nutri.duracao).map((hora) => ({
        hora,
        livre: !tomados.has(hora) && `${data} ${hora}` > agora(),
      }))
    );
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

export default router;
