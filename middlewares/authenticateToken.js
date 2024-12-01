import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

function authenticateToken(req, res, next) {
  console.log("SECRET_KEY:", SECRET_KEY);
  console.log("Rota acessada:", req.originalUrl);
  console.log("Cookies recebidos:", req.cookies);

  // Verifica se o token existe no cookie
  const token = req.cookies?.auth_token;

  if (!token) {
    console.warn("Token ausente no cookie");
    return res.status(403).json({ error: "Acesso negado: Token não fornecido" });
  }

  // Verifica o token usando o JWT
  jwt.verify(token, SECRET_KEY, { algorithms: ["HS512"] }, (err, user) => {
    if (err) {
      console.error("[Erro] Token inválido:", err.message);
      return res.status(403).json({ error: "Acesso negado: Token inválido" });
    }

    // Adiciona os dados do usuário à requisição
    req.user = user;
    console.log("Usuário autenticado:", user);

    next();
  });
}

export default authenticateToken;
