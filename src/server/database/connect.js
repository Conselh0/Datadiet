import mongoose from "mongoose";
import "dotenv/config";

const connectToDatabase = async () => {
  try {
    if (!process.env.MONGODB_URL) {
      throw new Error(
        "A variável MONGODB_URI não foi encontrada no arquivo .env.",
      );
    }

    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Conexão com o banco de dados foi um sucesso");
  } catch (error) {
    console.log("Ocorreu um erro na conexão com o banco", error);
    process.exit(1); //faz com que, se der errado, o código pare a execução
  }
};

export default connectToDatabase;
