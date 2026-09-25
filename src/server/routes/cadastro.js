import express from "express";
import cors from "cors";

const app = express();
app.use(cors()); //middleware para sempre usarmos o cors
app.use(express.json()); // vai ler o vody do post/put

//Fazer a mão amanhã
app.post("/cadastro", (req, res) => {});

const port = 8080;

app.listen(port, () => console.log(`Rodando o express na porta ${port}`));

export default app;
