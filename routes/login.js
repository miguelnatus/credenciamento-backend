const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../db/db'); // Configuração do Knex
const usuarioController = require('../controllers/usuarioController'); // Importa o usuarioController

const SECRET_KEY = process.env.SECRET_KEY || 'sua_chave_secreta';

// Rota de login
router.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar o usuário no MySQL pelo email
    const user = await db('users').where({ email }).first();

    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Verificar se a senha está correta
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Se a senha estiver correta, gerar o token JWT
    const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// Rota para recuperação de senha, sem autenticação
router.post('/esqueci-senha', usuarioController.forgotPassword);

// Rota para redefinir senha, sem autenticação
router.post('/redefinir-senha', usuarioController.resetPassword);

module.exports = router;
