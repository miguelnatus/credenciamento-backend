// controllers/registerController.js
const bcrypt = require('bcrypt');
const db = require('../db/db'); // Importa a conexão com o banco de dados MySQL usando Knex

async function registerUser(req, res) {
  const { nome, password, email } = req.body;

  try {
    // Verificar se todos os campos foram enviados
    if (!nome || !password || !email) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    // Verificar se o usuário já existe
    const existingUser = await db('users').where({ email }).first();
    if (existingUser) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Definir o novo usuário com os dados recebidos
    const novoUsuario = {
      email,
      nome,
      password: hashedPassword,
      criado_em: new Date()  // Define a data de criação como a data atual
    };

    // Inserir o novo usuário no banco de dados
    await db('users').insert(novoUsuario);

    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ message: 'Erro no servidor ao registrar usuário' });
  }
}

module.exports = {
  registerUser,
};
