import express from "express";
import UserModel from "../models/user.model.js";

// Criamos um roteador para este arquivo específico
const perfilRouter = express.Router(); 

perfilRouter.get("/perfil", async (req, res) => {
    try {
        const dados = await UserModel.find();
        return res.status(200).json(dados);
    } catch(error) {
        console.log(error);
        return res.status(500).json({ erro: "Erro ao buscar dados" });
    }
});

// Exporta apenas o roteador de forma limpa
export default perfilRouter;
