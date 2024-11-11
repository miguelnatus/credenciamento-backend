const db = require('../db/db');

// Função para listar todos os produtos
exports.getAllProdutos = async (req, res) => {
  try {
    const produtos = await db('produtos').select('*');
    res.json(produtos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
};

// Função para criar um produto
exports.createProduto = async (req, res) => {
  const { nome, descricao, preco, quantidade } = req.body;
  try {
    const [id] = await db('produtos').insert({ nome, descricao, preco, quantidade });
    res.status(201).json({ id, nome, descricao, preco, quantidade });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
};