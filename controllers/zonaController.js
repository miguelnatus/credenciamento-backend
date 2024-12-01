import prisma from '../db/db.js'; // Importação do Prisma Client

// Função para criar uma nova zona
export const createZona = async (req, res) => {
    const { nome, descricao } = req.body;

    try {
        const novaZona = await prisma.zonas.create({
            data: {
                nome,
                descricao,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });

        res.status(201).json({ message: 'Zona criada com sucesso', id: novaZona.id });
    } catch (error) {
        console.error("Erro ao criar zona:", error);
        res.status(500).json({ error: 'Erro ao criar zona' });
    }
};

// Função para obter todas as zonas
export const getAllZonas = async (req, res) => {
    try {
        const zonas = await prisma.zonas.findMany({
            where: { deleted_at: null },
        });

        res.json(zonas);
    } catch (error) {
        console.error("Erro ao buscar zonas:", error);
        res.status(500).json({ error: 'Erro ao buscar zonas' });
    }
};

// Função para obter uma zona pelo ID
export const getZonaById = async (req, res) => {
    const { id } = req.params;

    try {
        const zona = await prisma.zonas.findUnique({
            where: { id: parseInt(id) },
        });

        if (!zona) {
            return res.status(404).json({ message: 'Zona não encontrada' });
        }

        res.json(zona);
    } catch (error) {
        console.error("Erro ao buscar zona:", error);
        res.status(500).json({ error: 'Erro ao buscar zona' });
    }
};

// Função para atualizar uma zona pelo ID
export const updateZona = async (req, res) => {
    const { id } = req.params;
    const { nome, descricao } = req.body;

    try {
        const zonaAtualizada = await prisma.zonas.update({
            where: { id: parseInt(id) },
            data: {
                nome,
                descricao,
                updated_at: new Date(),
            },
        });

        res.json({ message: 'Zona atualizada com sucesso', zonaAtualizada });
    } catch (error) {
        console.error("Erro ao atualizar zona:", error);
        res.status(500).json({ error: 'Erro ao atualizar zona' });
    }
};

// Função para excluir uma zona (soft delete)
export const deleteZona = async (req, res) => {
    const { id } = req.params;

    try {
        const zonaDeletada = await prisma.zonas.update({
            where: { id: parseInt(id) },
            data: { deleted_at: new Date() },
        });

        res.json({ message: 'Zona excluída com sucesso', zonaDeletada });
    } catch (error) {
        console.error("Erro ao excluir zona:", error);
        res.status(500).json({ error: 'Erro ao excluir zona' });
    }
};
