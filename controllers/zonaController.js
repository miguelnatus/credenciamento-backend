const db = require('../db/db');

// Função para obter todas as zonas
async function getAllZonas(req, res) {
    try {
        const zonas = await db('zonas');
        res.json(zonas);
    } catch (error) {
        console.error("Erro ao buscar zonas:", error);
        res.status(500).json({ error: 'Erro ao buscar zonas' });
    }
}

// Função para criar uma nova zona
async function createZona(req, res) {
    const { nome, descricao } = req.body;

    try {
        const [id] = await db('zonas').insert({
            nome,
            descricao
        });

        res.status(201).json({ id });
    } catch (error) {
        console.error("Erro ao criar zona:", error);
        res.status(500).json({ error: 'Erro ao criar zona' });
    }
}

// Função para obter uma zona pelo ID
async function getZonaById(req, res) {
    const { id } = req.params;

    try {
        const zona = await db('zonas').where({ id }).first();
        if (zona) {
            res.json(zona);
        } else {
            res.status(404).json({ error: 'Zona não encontrada' });
        }
    } catch (error) {
        console.error("Erro ao buscar zona:", error);
        res.status(500).json({ error: 'Erro ao buscar zona' });
    }
}

// Função para atualizar uma zona pelo ID
async function updateZona(req, res) {
    const { id } = req.params;
    const { nome, descricao } = req.body;

    try {
        const updated = await db('zonas')
            .where({ id })
            .update({
                nome,
                descricao
            });

        if (updated) {
            res.json({ message: 'Zona atualizada com sucesso' });
        } else {
            res.status(404).json({ error: 'Zona não encontrada' });
        }
    } catch (error) {
        console.error("Erro ao atualizar zona:", error);
        res.status(500).json({ error: 'Erro ao atualizar zona' });
    }
}

// Função para deletar uma zona pelo ID
async function deleteZona(req, res) {
    const { id } = req.params;

    try {
        const deleted = await db('zonas').where({ id }).del();

        if (deleted) {
            res.json({ message: 'Zona deletada com sucesso' });
        } else {
            res.status(404).json({ error: 'Zona não encontrada' });
        }
    } catch (error) {
        console.error("Erro ao deletar zona:", error);
        res.status(500).json({ error: 'Erro ao deletar zona' });
    }
}

module.exports = {
    getAllZonas,
    createZona,
    getZonaById,
    updateZona,
    deleteZona
};
