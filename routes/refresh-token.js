import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
const router = express.Router();
import prisma from '../db/db.js'; // Prisma Client
import usuarioController from '../controllers/usuarioController.js';

const SECRET_KEY = process.env.SECRET_KEY || 'sua_chave_secreta';
const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION || '1h'; // Tempo de expiração configurável

// Rota de login
router.post('/', async (req, res) => {
  const { email, password } = req.body;

  // Verificação inicial de campos
  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios' });
  }

  try {
    // Buscar o usuário no banco de dados usando Prisma
    const user = await prisma.users.findUnique({
      where: { email }
    });

    console.log(user);

    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Verificar se a senha está correta
    const passwordMatch = await bcrypt.compare(password, user.senha);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Gerar o token JWT com informações adicionais
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role || 'user' },
      SECRET_KEY,
      { expiresIn: TOKEN_EXPIRATION }
    );

    res.json({ token });
  } catch (error) {
    console.error('Erro ao fazer login:', error.message);
    res.status(500).json({ message: 'Erro no servidor. Tente novamente mais tarde.' });
  }
});

// Rota para recuperação de senha, sem autenticação
router.post('/esqueci-senha', usuarioController.forgotPassword);

// Rota para redefinir senha, sem autenticação
router.post('/redefinir-senha', usuarioController.resetPassword);

export default router;
