const db = require('../db/db');

// Função para obter todos os setores
async function getAllSetores(req, res) {
    try {
        const setores = await db('setores');
        res.json(setores);
    } catch (error) {
        console.error("Erro ao buscar setores:", error);
        res.status(500).json({ error: 'Erro ao buscar setores' });
    }
}

// Função para criar um novo setor
async function createSetor(req, res) {
    const { nome, valor, tipo, hora_entrada, hora_saida } = req.body;

    try {
        const [id] = await db('setores').insert({
            nome,
            valor,
            tipo,
            hora_entrada,
            hora_saida
        });

        res.status(201).json({ id });
    } catch (error) {
        console.error("Erro ao criar setor:", error);
        res.status(500).json({ error: 'Erro ao criar setor' });
    }
}

// Função para obter um setor pelo ID
async function getSetorById(req, res) {
    const { id } = req.params;

    try {
        const setor = await db('setores').where({ id }).first();
        if (setor) {
            res.json(setor);
        } else {
            res.status(404).json({ error: 'Setor não encontrado' });
        }
    } catch (error) {
        console.error("Erro ao buscar setor:", error);
        res.status(500).json({ error: 'Erro ao buscar setor' });
    }
}

// Função para atualizar um setor pelo ID
async function updateSetor(req, res) {
    const { id } = req.params;
    const { nome, valor, tipo, hora_entrada, hora_saida } = req.body;

    try {
        const updated = await db('setores')
            .where({ id })
            .update({
                nome,
                valor,
                tipo,
                hora_entrada,
                hora_saida
            });

        if (updated) {
            res.json({ message: 'Setor atualizado com sucesso' });
        } else {
            res.status(404).json({ error: 'Setor não encontrado' });
        }
    } catch (error) {
        console.error("Erro ao atualizar setor:", error);
        res.status(500).json({ error: 'Erro ao atualizar setor' });
    }
}

// Função para deletar um setor pelo ID
async function deleteSetor(req, res) {
    const { id } = req.params;

    try {
        const deleted = await db('setores').where({ id }).del();

        if (deleted) {
            res.json({ message: 'Setor deletado com sucesso' });
        } else {
            res.status(404).json({ error: 'Setor não encontrado' });
        }
    } catch (error) {
        console.error("Erro ao deletar setor:", error);
        res.status(500).json({ error: 'Erro ao deletar setor' });
    }
}

module.exports = {
    getAllSetores,
    createSetor,
    getSetorById,
    updateSetor,
    deleteSetor
};
