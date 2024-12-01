import prisma from '../db/db.js'; // Configuração do Prisma

// Função para listar todos os produtos
export const getAllProdutos = async (req, res) => {
  try {
    const produtos = await prisma.produtos.findMany();
    res.json(produtos);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
};

// Função para criar um produto
export const createProduto = async (req, res) => {
  const { nome, descricao, preco, quantidade } = req.body;
  
  try {
    const newProduto = await prisma.produtos.create({
      data: {
        nome,
        descricao,
        preco,
        quantidade,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    res.status(201).json(newProduto);
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
};
