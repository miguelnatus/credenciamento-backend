import prisma from '../db/db.js'; // Configuração do Prisma

// Função para obter todos os setores
export const getAllSetores = async (req, res) => {
  try {
    const setores = await prisma.setores.findMany();
    res.json(setores);
  } catch (error) {
    console.error("Erro ao buscar setores:", error);
    res.status(500).json({ error: 'Erro ao buscar setores' });
  }
};

// Função para criar um novo setor
export const createSetor = async (req, res) => {
  const { nome, valor, tipo, hora_entrada, hora_saida } = req.body;

  try {
    const newSetor = await prisma.setores.create({
      data: {
        nome,
        valor,
        tipo,
        hora_entrada,
        hora_saida,
      },
    });

    res.status(201).json({ id: newSetor.id });
  } catch (error) {
    console.error("Erro ao criar setor:", error);
    res.status(500).json({ error: 'Erro ao criar setor' });
  }
};

// Função para obter um setor pelo ID
export const getSetorById = async (req, res) => {
  const { id } = req.params;

  try {
    const setor = await prisma.setores.findUnique({
      where: { id: Number(id) },
    });

    if (setor) {
      res.json(setor);
    } else {
      res.status(404).json({ error: 'Setor não encontrado' });
    }
  } catch (error) {
    console.error("Erro ao buscar setor:", error);
    res.status(500).json({ error: 'Erro ao buscar setor' });
  }
};

// Função para atualizar um setor pelo ID
export const updateSetor = async (req, res) => {
  const { id } = req.params;
  const { nome, valor, tipo, hora_entrada, hora_saida } = req.body;

  try {
    const updatedSetor = await prisma.setores.update({
      where: { id: Number(id) },
      data: {
        nome,
        valor,
        tipo,
        hora_entrada,
        hora_saida,
      },
    });

    if (updatedSetor) {
      res.json({ message: 'Setor atualizado com sucesso' });
    } else {
      res.status(404).json({ error: 'Setor não encontrado' });
    }
  } catch (error) {
    console.error("Erro ao atualizar setor:", error);
    res.status(500).json({ error: 'Erro ao atualizar setor' });
  }
};

// Função para deletar um setor pelo ID
export const deleteSetor = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedSetor = await prisma.setores.update({
      where: { id: Number(id) },
      data: { deleted_at: new Date() },
    });

    if (deletedSetor) {
      res.json({ message: 'Setor deletado com sucesso' });
    } else {
      res.status(404).json({ error: 'Setor não encontrado' });
    }
  } catch (error) {
    console.error("Erro ao deletar setor:", error);
    res.status(500).json({ error: 'Erro ao deletar setor' });
  }
};
