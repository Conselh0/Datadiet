//Arquivo que vai rodar toda a aplicação do connect
import "dotenv/config"; //Já faz toda aquela parte de config do dot.env
import connectToDatabase from "./database/connect.js";
import "./modules/test.js"; //Funciona exatamente como o require

connectToDatabase();
