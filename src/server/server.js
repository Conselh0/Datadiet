import "dotenv/config";
import connectToDatabase from "./database/connect.js";
import app from "./routes/cadastro.js";

// Espera a conexão terminar e só depois sobe o servidor. Sobe o servidor e então fica escutando
connectToDatabase().then(() => {
  const port = 8080;
  app.listen(port, () => console.log(`Rodando na porta ${port}`));
});
