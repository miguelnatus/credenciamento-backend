import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto'; // Para gerar o CSRF token
const router = express.Router();
import prisma from '../db/db.js'; // Prisma Client
import usuarioController from '../controllers/usuarioController.js';

const registerUser = async (req, res) => {
  const { nome, password, email } = req.body;

  try {
    if (!nome || !password || !email) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Todos os campos são obrigatórios',
      });
    }

    const usuarioExistente = await prisma.users.findUnique({
      where: { email },
    });

    if (usuarioExistente) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Este email já está cadastrado',
      });
    }

    const senhaHash = await bcrypt.hash(password, 10);

    await prisma.users.create({
      data: {
        email,
        nome,
        senha: senhaHash,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    return res.status(201).json({
      sucesso: true,
      mensagem: 'Usuário cadastrado com sucesso',
    });
  } catch (erro) {
    console.error('Erro ao cadastrar usuário:', erro);
    return res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor',
    });
  }
};

export default registerUser;