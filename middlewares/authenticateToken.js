import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY || "default_secret_key";

export const authenticateToken = (req, res, next) => {
  console.log("[Auth] Middleware de autenticação acionado.");
  
  const token = req.cookies?.auth_token; // Obtém o token do cookie

  if (!token) {
    console.error("[Auth] Cookie 'auth_token' não encontrado.");
    return res.status(403).json({ error: "Acesso negado: Token não fornecido." });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.error("[Auth] Token inválido ou expirado:", err.message);
      return res.status(403).json({ error: "Acesso negado: Token inválido ou expirado." });
    }

    req.user = user; // Adiciona os dados do usuário à requisição
    console.log("[Auth] Usuário autenticado:", user);
    next();
  });
};
