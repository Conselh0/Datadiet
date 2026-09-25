//Arquivo que vai rodar todo o back
import "dotenv/config"; //Já faz toda aquela parte de config do dot.env
import connectToDatabase from "./database/connect.js";
import "./routes/cadastro.js"; //Funciona exatamente como o require

connectToDatabase();
