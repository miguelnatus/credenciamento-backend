const bcrypt = require('bcrypt');
const db = require('../db/db');

async function registerUser(req, res) {
  const { nome, password, email } = req.body;

  try {
    if (!nome || !password || !email) {
      return res.status(400).json({ 
        sucesso: false,
        mensagem: 'Todos os campos são obrigatórios' 
      });
    }

    const usuarioExistente = await db('users')
      .where({ email })
      .whereNull('deleted_at')
      .first();

    if (usuarioExistente) {
      return res.status(400).json({ 
        sucesso: false,
        mensagem: 'Este email já está cadastrado' 
      });
    }

    const senhaHash = await bcrypt.hash(password, 10);

    const novoUsuario = {
      email,
      nome,
      senha: senhaHash,
      created_at: new Date(),
      updated_at: new Date()
    };

    await db('users').insert(novoUsuario);

    return res.status(201).json({
      sucesso: true,
      mensagem: 'Usuário cadastrado com sucesso'
    });

  } catch (erro) {
    console.error('Erro ao cadastrar usuário:', erro);
    return res.status(500).json({ 
      sucesso: false,
      mensagem: 'Erro interno do servidor'
    });
  }
}

module.exports = {
  registerUser
};