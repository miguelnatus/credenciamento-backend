import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY || "default_secret_key";

// Endpoint para renovação do token
router.post("/", (req, res) => {
  const token = req.cookies?.auth_token;

  // Verifica se o token está presente
  if (!token) {
    return res.status(403).json({ error: "Token ausente. Faça login novamente." });
  }

  // Verifica o token
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.error("Erro ao validar token:", err.message);
      return res.status(403).json({ error: "Token inválido ou expirado. Faça login novamente." });
    }

    // Gera um novo token com os mesmos dados do token original
    const newToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role || "user" },
      SECRET_KEY,
      {
        algorithm: "HS512",
        expiresIn: "1h", // Define o tempo de expiração do novo token
      }
    );

    // Configura o cookie com o novo token
    res.cookie("auth_token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // Expira em 1 hora
    });

    return res.status(200).json({ message: "Token renovado com sucesso" });
  });
});

export default router;
