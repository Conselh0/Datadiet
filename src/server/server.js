import "dotenv/config";
import connectToDatabase from "./database/connect.js";
import app from "./routes/cadastro.js";
import agendamentoRoutes from "./routes/agendamento.js"; //Caminho do
import authRoutes from "./routes/auth.js";

app.use(agendamentoRoutes); //Verificar essa linha se der erro no agendamento
app.use(authRoutes);

connectToDatabase().then(() => {
  const port = 8080;
  app.listen(port, () => console.log(`Rodando na porta ${port}`));
});