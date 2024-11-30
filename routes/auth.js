const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // Para gerar o token CSRF
const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY || 'default_secret_key';

// Rota de login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Lógica de autenticação (substitua pela real)
    if (email === 'user@example.com' && password === '123456') {
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
    }

    return res.status(401).json({ message: 'Credenciais inválidas' });
});

module.exports = router;
