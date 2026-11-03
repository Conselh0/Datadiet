import "dotenv/config";
import connectToDatabase from "./database/connect.js";
import app from "./routes/cadastro.js";
import agendamentoRoutes from "./routes/agendamento.js"; //Caminho do 
import perfilRouter from "./routes/perfilUsuario.js"
import authRoutes from "./routes/auth.js";
import nutricionistaRoutes from "./routes/nutricionista.js";
import anamneseRoutes from "./routes/anamnese.js";
import { iniciarLembretesAgendamento } from "./services/lembretesAgendamento.js";

app.use(agendamentoRoutes); //Verificar essa linha se der erro no agendamento
app.use(anamneseRoutes);
app.use(perfilRouter)
app.use(authRoutes);
app.use("/", nutricionistaRoutes);

connectToDatabase().then(() => {
  iniciarLembretesAgendamento();
  const port = process.env.PORT || 8080; // Adicionei process.env.PORT para configurar hospedagem.
  app.listen(port, () => console.log(`Rodando na porta ${port}`));
});