import prisma from '../db/db.js'; // Configuração do Prisma

// Função para obter todas as produtoras
export const getAllProdutoras = async (req, res) => {
  try {
    const produtoras = await prisma.produtoras.findMany({
      where: { deleted_at: null },
    });
    res.json(produtoras);
  } catch (error) {
    console.error("Erro ao buscar produtoras:", error);
    res.status(500).json({ error: 'Erro ao buscar produtoras' });
  }
};

// Função para criar uma nova produtora
export const createProdutora = async (req, res) => {
  const { nome, descricao } = req.body;

  try {
    const newProdutora = await prisma.produtoras.create({
      data: {
        nome,
        descricao,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    res.status(201).json({ id: newProdutora.id });
  } catch (error) {
    console.error("Erro ao criar produtora:", error);
    res.status(500).json({ error: 'Erro ao criar produtora' });
  }
};

// Função para obter uma produtora pelo ID
export const getProdutoraById = async (req, res) => {
  const { id } = req.params;

  try {
    const produtora = await prisma.produtoras.findUnique({
      where: { id },
    });

    if (produtora && !produtora.deleted_at) {
      res.json(produtora);
    } else {
      res.status(404).json({ error: 'Produtora não encontrada' });
    }
  } catch (error) {
    console.error("Erro ao buscar produtora:", error);
    res.status(500).json({ error: 'Erro ao buscar produtora' });
  }
};

// Função para atualizar uma produtora pelo ID
export const updateProdutora = async (req, res) => {
  const { id } = req.params;
  const { nome, descricao } = req.body;

  try {
    const updatedProdutora = await prisma.produtoras.update({
      where: { id },
      data: {
        nome,
        descricao,
        updated_at: new Date(),
      },
    });

    res.json({ message: 'Produtora atualizada com sucesso' });
  } catch (error) {
    console.error("Erro ao atualizar produtora:", error);
    res.status(500).json({ error: 'Erro ao atualizar produtora' });
  }
};

// Função para deletar uma produtora pelo ID (soft delete)
export const deleteProdutora = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProdutora = await prisma.produtoras.update({
      where: { id },
      data: { deleted_at: new Date() },
    });

    res.json({ message: 'Produtora deletada com sucesso' });
  } catch (error) {
    console.error("Erro ao deletar produtora:", error);
    res.status(500).json({ error: 'Erro ao deletar produtora' });
  }
};
