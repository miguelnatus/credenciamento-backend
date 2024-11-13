const db = require('../db/db');

// Função para obter todas as produtoras
async function getAllProdutoras(req, res) {
    try {
        const produtoras = await db('produtoras').whereNull('deleted_at');
        res.json(produtoras);
    } catch (error) {
        console.error("Erro ao buscar produtoras:", error);
        res.status(500).json({ error: 'Erro ao buscar produtoras' });
    }
}

// Função para criar uma nova produtora
async function createProdutora(req, res) {
    const { nome, descricao } = req.body;

    try {
        const [id] = await db('produtoras').insert({
            nome,
            descricao,
            created_at: new Date(),
            updated_at: new Date()
        });

        res.status(201).json({ id });
    } catch (error) {
        console.error("Erro ao criar produtora:", error);
        res.status(500).json({ error: 'Erro ao criar produtora' });
    }
}

// Função para obter uma produtora pelo ID
async function getProdutoraById(req, res) {
    const { id } = req.params;

    try {
        const produtora = await db('produtoras').where({ id }).whereNull('deleted_at').first();
        if (produtora) {
            res.json(produtora);
        } else {
            res.status(404).json({ error: 'Produtora não encontrada' });
        }
    } catch (error) {
        console.error("Erro ao buscar produtora:", error);
        res.status(500).json({ error: 'Erro ao buscar produtora' });
    }
}

// Função para atualizar uma produtora pelo ID
async function updateProdutora(req, res) {
    const { id } = req.params;
    const { nome, descricao } = req.body;

    try {
        const updated = await db('produtoras').where({ id }).update({
            nome,
            descricao,
            updated_at: new Date()
        });

        if (updated) {
            res.json({ message: 'Produtora atualizada com sucesso' });
        } else {
            res.status(404).json({ error: 'Produtora não encontrada' });
        }
    } catch (error) {
        console.error("Erro ao atualizar produtora:", error);
        res.status(500).json({ error: 'Erro ao atualizar produtora' });
    }
}

// Função para deletar uma produtora pelo ID
async function deleteProdutora(req, res) {
    const { id } = req.params;

    try {
        const deleted = await db('produtoras').where({ id }).update({
            deleted_at: new Date()
        });

        if (deleted) {
            res.json({ message: 'Produtora deletada com sucesso' });
        } else {
            res.status(404).json({ error: 'Produtora não encontrada' });
        }
    } catch (error) {
        console.error("Erro ao deletar produtora:", error);
        res.status(500).json({ error: 'Erro ao deletar produtora' });
    }
}

module.exports = {
    getAllProdutoras,
    createProdutora,
    getProdutoraById,
    updateProdutora,
    deleteProdutora,
};