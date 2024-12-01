import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'; // Para gerar o token CSRF
import prisma from '../db/db.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY || 'default_secret_key';

// Rota de login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Busca o usuário no banco de dados pelo email
        const user = await prisma.users.findUnique({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        // Verifica se a senha está correta
        const passwordMatch = await bcrypt.compare(password, user.senha);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        // Gera o token JWT
        const token = jwt.sign({ email }, SECRET_KEY, {
            algorithm: 'HS512',
            expiresIn: '1h',
        });

        // Gera um token CSRF único
        const csrfToken = crypto.randomBytes(32).toString('hex');

        // Configura cookies
        res.cookie('auth_token', token, {
            httpOnly: true, // Segurança contra XSS
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 1000, // Expira em 1 hora
        });

        res.cookie('csrf_token', csrfToken, {
            httpOnly: false, // Acessível pelo frontend
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 1000, // Expira em 1 hora
        });

        return res.status(200).json({ message: 'Login bem-sucedido' });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        return res.status(500).json({ message: 'Erro no servidor. Tente novamente mais tarde.' });
    }
});

export default router;
