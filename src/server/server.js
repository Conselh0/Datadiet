import "dotenv/config";
import connectToDatabase from "./database/connect.js";
import app from "./routes/cadastro.js";
import agendamentoRoutes from "./routes/agendamento.js"; //Caminho do 

app.use(agendamentoRoutes); //Verificar essa linha se der erro no agendamento

connectToDatabase().then(() => {
  const port = 8080;
  app.listen(port, () => console.log(`Rodando na porta ${port}`));
});
