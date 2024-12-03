import express from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto"; // Para gerar o token CSRF
import prisma from "../db/db.js";
import bcrypt from "bcryptjs";

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY || "default_secret_key";

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.users.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    const passwordMatch = await bcrypt.compare(password, user.senha);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role || "user" },
      SECRET_KEY,
      {
        algorithm: "HS512",
        expiresIn: "1h",
      }
    );

    const csrfToken = crypto.randomBytes(32).toString("hex");

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });

    res.cookie("csrf_token", csrfToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });

    console.log("Token JWT gerado:", token);
    console.log("Token CSRF gerado:", csrfToken);

    return res.status(200).json({
      message: "Login bem-sucedido",
      user: {
        id: user.id,
        email: user.email,
        nome: user.nome,
        role: user.role || "user",
      },
    });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return res.status(500).json({ message: "Erro no servidor. Tente novamente mais tarde." });
  }
});

export default router;
