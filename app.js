import express from "express";
import cookieParser from "cookie-parser";
import { configureCors } from "./middlewares/corsConfig.js"; // Certifique-se que o caminho está correto
import routes from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 8000;

// Middlewares
configureCors(app); // Configurar CORS primeiro
app.use(express.json());
app.use(cookieParser());

// Rotas
app.use("/api", routes);

// Erros
app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});
app.use((err, req, res) => {
  console.error("Erro interno do servidor:", err);
  res.status(500).json({ error: err.message || "Erro interno do servidor" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
