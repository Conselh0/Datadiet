import express from "express";
import cors from "cors";

const app = express();
app.use(cors()); //middleware para sempre usarmos o cors
app.use(express.json()); // vai ler o vody do post/put

app.get("/users", (req, res) => {
  res.status(200).send("<h1>hello Piter</h1>");
});

const port = 8080;

app.listen(port, () => console.log(`Rodando o express na porta ${port}`));

export default app;
