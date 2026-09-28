import mongoose from "mongoose";
import "dotenv/config";

const connectToDatabase = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@datadiet.gpqymue.mongodb.net/?appName=Datadiet`,
    );
    console.log("Conexão com o banco de dados foi um sucesso");
  } catch (error) {
    console.log("Ocorreu um erro na conexão com o banco", error);
    process.exit(1); //faz com que, se der errado, o código pare a execução
  }
};

export default connectToDatabase;
