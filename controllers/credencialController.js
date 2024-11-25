const db = require('../db/db');

// Função para obter todas as credenciais
async function getAllCredenciais(req, res) {
    try {
        const credenciais = await db('credenciais');
        res.json(credenciais);
    } catch (error) {
        console.error("Erro ao buscar credenciais:", error);
        res.status(500).json({ error: 'Erro ao buscar credenciais' });
    }
}

// Função para criar uma nova credencial
async function createCredencial(req, res) {
    const { pessoa_id, veiculo_id, evento_id, empresa_id, setor_id, status_id } = req.body;

    try {
        const [id] = await db('credenciais').insert({
            pessoa_id,
            veiculo_id,
            evento_id,
            empresa_id,
            setor_id,
            status_id
        });

        res.status(201).json({ id });
    } catch (error) {
        console.error("Erro ao criar credencial:", error);
        res.status(500).json({ error: 'Erro ao criar credencial' });
    }
}

// Função para obter uma credencial pelo ID
async function getCredencialById(req, res) {
    const { id } = req.params;

    try {
        const credencial = await db('credenciais').where({ id }).first();
        if (credencial) {
            res.json(credencial);
        } else {
            res.status(404).json({ error: 'Credencial não encontrada' });
        }
    } catch (error) {
        console.error("Erro ao buscar credencial:", error);
        res.status(500).json({ error: 'Erro ao buscar credencial' });
    }
}

// Função para atualizar uma credencial pelo ID
async function updateCredencial(req, res) {
    const { id } = req.params;
    const { pessoa_id, veiculo_id, evento_id, empresa_id, setor_id, status_id } = req.body;

    try {
        const updated = await db('credenciais').where({ id }).update({
            pessoa_id,
            veiculo_id,
            evento_id,
            empresa_id,
            setor_id,
            status_id
        });

        if (updated) {
            res.json({ message: 'Credencial atualizada com sucesso' });
        } else {
            res.status(404).json({ error: 'Credencial não encontrada' });
        }
    } catch (error) {
        console.error("Erro ao atualizar credencial:", error);
        res.status(500).json({ error: 'Erro ao atualizar credencial' });
    }
}

// Função para deletar uma credencial pelo ID
async function deleteCredencial(req, res) {
    const { id } = req.params;

    try {
        const deleted = await db('credenciais').where({ id }).del();

        if (deleted) {
            res.json({ message: 'Credencial deletada com sucesso' });
        } else {
            res.status(404).json({ error: 'Credencial não encontrada' });
        }
    } catch (error) {
        console.error("Erro ao deletar credencial:", error);
        res.status(500).json({ error: 'Erro ao deletar credencial' });
    }
}

module.exports = {
    getAllCredenciais,
    createCredencial,
    getCredencialById,
    updateCredencial,
    deleteCredencial
};

