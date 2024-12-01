import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto'; // Para gerar o CSRF token
const router = express.Router();
import prisma from '../db/db.js'; // Prisma Client
import usuarioController from '../controllers/usuarioController.js';

const SECRET_KEY = process.env.SECRET_KEY || 'sua_chave_secreta';
const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION || '1h'; // Tempo de expiração configurável

// Rota de login
router.post('/', async (req, res) => {
  try {
    console.log('Headers recebidos:', req.headers);
    console.log('Body recebido:', req.body);

    const { email, password } = req.body;

    // Validação inicial dos campos
    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    // Busca o usuário no banco de dados
    const user = await prisma.users.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Verifica se a senha fornecida corresponde à senha armazenada
    const isPasswordValid = await bcrypt.compare(password, user.senha);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Gera o token JWT com informações do usuário
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role || 'user' },
      SECRET_KEY,
      { expiresIn: TOKEN_EXPIRATION }
    );

    console.log('Token gerado:', token);

    // Gera um token CSRF
    const csrfToken = crypto.randomBytes(32).toString('hex');

    // Configura o cookie HTTP-Only para o token JWT
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    // Configura o cookie acessível ao frontend para o token CSRF
    res.cookie('csrf_token', csrfToken, {
      httpOnly: false, // Acessível ao frontend
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    // Retorna os dados do usuário e o token CSRF
    res.status(200).json({
      message: 'Login bem-sucedido',
      csrfToken, // Retorna o token CSRF no corpo também, caso necessário
      user: {
        id: user.id,
        email: user.email,
        nome: user.nome,
      },
    });
  } catch (error) {
    console.error('Erro ao processar login:', error);
    res.status(500).json({ message: 'Erro no servidor. Tente novamente mais tarde.' });
  }
});

// Rota para recuperação de senha, sem autenticação
router.post('/esqueci-senha', usuarioController.forgotPassword);

// Rota para redefinir senha, sem autenticação
router.post('/redefinir-senha', usuarioController.resetPassword);

export default router;
