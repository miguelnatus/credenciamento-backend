import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

function authenticateToken(req, res, next) {
  console.log("SECRET_KEY:", SECRET_KEY);
  console.log("Rota acessada:", req.originalUrl);
  console.log("Cookies recebidos:", req.cookies);

  const token = req.cookies?.auth_token;
  console.log("Token recebido:", token);

  if (!token) {
    return res.status(403).json({ error: "Acesso negado: Token não fornecido" });
  }

  jwt.verify(token, SECRET_KEY, { algorithms: ["HS512"] }, (err, user) => {
    if (err) {
      console.error("[Erro] Token inválido:", err.message);
      return res.status(403).json({ error: "Acesso negado: Token inválido" });
    }
    req.user = user;
    next();
  });
}

export default authenticateToken; // Certifique-se de exportar como `default`
