import prisma from '../db/db.js'; 
import nodemailer from 'nodemailer'; 
import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken'; 
import crypto from 'crypto'; 

const SECRET_KEY = process.env.SECRET_KEY || 'sua_chave_secreta';

export const loginUser = async (req, res) => {
    const { email, senha } = req.body;
    try {
      const user = await prisma.user.findUnique({ where: { email } });
  
      if (user && bcrypt.compareSync(senha, user.senha)) {
        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
            nome: user.nome,
          },
          SECRET_KEY,
          { expiresIn: '1h' }
        );
  
        res.json({
          token,
          user: {
            id: user.id,
            nome: user.nome,
            email: user.email,
          },
        });
      } else {
        res.status(401).json({ message: 'Email ou senha inválidos' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao fazer login' });
    }
};

async function forgotPassword(req, res) {
    const { email } = req.body;

    console.log('Solicitação de recuperação de senha para:', email);  // Log do e-mail recebido

    try {
        const user = await prisma.users.findUnique({
            where: { email },
        });

        if (!user) {
            console.log('Usuário não encontrado');
            return res.json({ message: 'E-mail de recuperação enviado, se o usuário existir.' });
        }

        const token = crypto.randomBytes(32).toString('hex');
        console.log('Token de recuperação gerado:', token);  // Log do token gerado

        await prisma.passwordResets.create({
            data: {
                email,
                token,
                expires_at: new Date(Date.now() + 3600000), // 1 hora
            },
        });

        // Configuração do e-mail
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Recuperação de Senha',
            text: `Use este link para redefinir sua senha: http://localhost:3000/redefinir-senha?token=${token}`,
        };

        await transporter.sendMail(mailOptions);
        console.log('E-mail de recuperação enviado para:', email);  // Log do envio do e-mail
        res.json({ message: 'E-mail de recuperação enviado, se o usuário existir.' });
    } catch (error) {
        console.error('Erro ao enviar e-mail de recuperação:', error);  // Log do erro
        res.status(500).json({ error: 'Erro ao enviar e-mail de recuperação.' });
    }
}


async function resetPassword(req, res) {
    const { token, newPassword } = req.body;

    console.log('Solicitação de redefinição de senha para o token:', token);  // Log do token recebido

    try {
        const passwordReset = await prisma.passwordResets.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!passwordReset || passwordReset.expires_at < new Date()) {
            console.log('Token inválido ou expirado');
            return res.status(400).json({ message: 'Token inválido ou expirado.' });
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        console.log('Nova senha hash gerada:', hashedPassword);  // Log da senha hash

        await prisma.user.update({
            where: { email: passwordReset.email },
            data: { senha: hashedPassword },
        });

        await prisma.passwordResets.delete({ where: { token } });

        console.log('Senha redefinida com sucesso para o e-mail:', passwordReset.email);  // Log da redefinição
        res.json({ message: 'Senha redefinida com sucesso.' });
    } catch (error) {
        console.error('Erro ao redefinir a senha:', error);  // Log do erro
        res.status(500).json({ error: 'Erro ao redefinir a senha.' });
    }
}


async function updateProfile(req, res) {
    const { email, nome } = req.body;

    console.log('Solicitação de atualização de perfil para o e-mail:', email);  // Log do e-mail e novo nome

    try {
        const user = await prisma.users.findUnique({ where: { email } });

        if (!user) {
            console.log('Usuário não encontrado');
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        await prisma.user.update({
            where: { email },
            data: { nome },
        });

        console.log('Perfil atualizado com sucesso para o e-mail:', email);  // Log da atualização
        res.json({ message: 'Perfil atualizado com sucesso.' });
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);  // Log do erro
        res.status(500).json({ error: 'Erro ao atualizar o perfil' });
    }
}


async function getAllUsers(req, res) {
    console.log('Solicitação para buscar todos os usuários');  // Log da solicitação

    try {
        const usuarios = await prisma.users.findMany();
        console.log('Número de usuários encontrados:', usuarios.length);  // Log do número de usuários encontrados
        res.json(usuarios);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);  // Log do erro
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
}


const usuarioController = {
    loginUser,
    forgotPassword,
    resetPassword,
    updateProfile,
    getAllUsers,
};

export default usuarioController;