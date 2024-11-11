// controllers/usuarioController.js
const db = require('../db/db'); // Configuração do Knex
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const SECRET_KEY = process.env.SECRET_KEY || 'sua_chave_secreta';

async function loginUser(req, res) {
    const { email, password } = req.body;
    try {
        const user = await db('users').where({ email }).first();

        if (user && bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.status(401).json({ message: 'Credenciais inválidas' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao fazer login' });
    }
}

async function forgotPassword(req, res) {
    const { email } = req.body;

    // Verificar se o usuário existe
    const user = await db('users').where({ email }).first();
    if (!user) {
        return res.json({ message: 'E-mail de recuperação enviado, se o usuário existir.' });
    }

    // Gerar token de recuperação
    const token = crypto.randomBytes(32).toString('hex');

    // Armazene o token no banco de dados com expiração (exemplo: 1 hora)
    await db('password_resets').insert({
        email,
        token,
        expires_at: new Date(Date.now() + 3600000) // 1 hora
    });

    // Configurar transporte do nodemailer
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Configurar e enviar e-mail
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Recuperação de Senha',
        text: `Use este link para redefinir sua senha: http://localhost:3000/redefinir-senha?token=${token}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: 'E-mail de recuperação enviado, se o usuário existir.' });
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        res.status(500).json({ error: 'Erro ao enviar e-mail de recuperação.' });
    }
}

async function resetPassword(req, res) {
    const { token, newPassword } = req.body;

    try {
        // Verificar se o token existe e não expirou
        const passwordReset = await db('password_resets')
            .where({ token })
            .andWhere('expires_at', '>', new Date())
            .first();

        if (!passwordReset) {
            return res.status(400).json({ message: 'Token inválido ou expirado.' });
        }

        // Encontrar o usuário pelo email associado ao token
        const user = await db('users').where({ email: passwordReset.email }).first();
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        // Hash da nova senha e atualizar no banco de dados
        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        await db('users').where({ email: passwordReset.email }).update({ password: hashedPassword });

        // Remover o token da tabela `password_resets`
        await db('password_resets').where({ token }).delete();

        res.json({ message: 'Senha redefinida com sucesso.' });
    } catch (error) {
        console.error('Erro ao redefinir a senha:', error);
        res.status(500).json({ error: 'Erro ao redefinir a senha.' });
    }
}

async function updateProfile(req, res) {
    console.log("Entrando na função updateProfile");
    const { email, nome } = req.body;
    try {
        const user = await db('users').where({ email }).first();
        console.log("Usuário encontrado:", user);

        if (!user) {
            console.log("Usuário não encontrado");
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        await db('users').where({ email }).update({ nome });
        console.log("Perfil atualizado com sucesso");
        res.json({ message: 'Perfil atualizado com sucesso.' });
    } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
        res.status(500).json({ error: 'Erro ao atualizar o perfil' });
    }
}



async function getAllUsers(req, res) {
    try {
        const usuarios = await db('users').select('*');
        res.json(usuarios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
}

module.exports = {
    loginUser,
    forgotPassword,
    resetPassword,
    updateProfile,
    getAllUsers,
};
