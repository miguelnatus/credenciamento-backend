const db = require('../db/db');

// Função para criar uma nova credencial de empresa
async function createCredencialEmpresa(req, res) {
    const { empresa_id, credencial_id, validade } = req.body;

    try {
        const [id] = await db('credenciais_empresa').insert({
            empresa_id,
            credencial_id,
            validade
        });

        res.status(201).json({ id, message: 'Credencial de empresa criada com sucesso' });
    } catch (error) {
        console.error("Erro ao criar credencial de empresa:", error);
        res.status(500).json({ error: 'Erro ao criar credencial de empresa' });
    }
}

// Função para obter todas as credenciais de empresa
async function getAllCredenciaisEmpresa(req, res) {
    try {
        const credenciais = await db('credenciais_empresa').select('*');
        res.json(credenciais);
    } catch (error) {
        console.error("Erro ao buscar credenciais de empresa:", error);
        res.status(500).json({ error: 'Erro ao buscar credenciais de empresa' });
    }
}

// Função para obter uma credencial de empresa pelo ID
async function getCredencialEmpresaById(req, res) {
    const { id } = req.params;

    try {
        const credencial = await db('credenciais_empresa').where({ id }).first();
        if (credencial) {
            res.json(credencial);
        } else {
            res.status(404).json({ error: 'Credencial de empresa não encontrada' });
        }
    } catch (error) {
        console.error("Erro ao buscar credencial de empresa:", error);
        res.status(500).json({ error: 'Erro ao buscar credencial de empresa' });
    }
}

// Função para atualizar uma credencial de empresa pelo ID
async function updateCredencialEmpresa(req, res) {
    const { id } = req.params;
    const { empresa_id, credencial_id, validade } = req.body;

    try {
        const updated = await db('credenciais_empresa').where({ id }).update({
            empresa_id,
            credencial_id,
            validade
        });

        if (updated) {
            res.json({ message: 'Credencial de empresa atualizada com sucesso' });
        } else {
            res.status(404).json({ error: 'Credencial de empresa não encontrada' });
        }
    } catch (error) {
        console.error("Erro ao atualizar credencial de empresa:", error);
        res.status(500).json({ error: 'Erro ao atualizar credencial de empresa' });
    }
}

// Função para deletar uma credencial de empresa pelo ID
async function deleteCredencialEmpresa(req, res) {
    const { id } = req.params;

    try {
        const deleted = await db('credenciais_empresa').where({ id }).del();

        if (deleted) {
            res.json({ message: 'Credencial de empresa deletada com sucesso' });
        } else {
            res.status(404).json({ error: 'Credencial de empresa não encontrada' });
        }
    } catch (error) {
        console.error("Erro ao deletar credencial de empresa:", error);
        res.status(500).json({ error: 'Erro ao deletar credencial de empresa' });
    }
}

module.exports = {
    createCredencialEmpresa,
    getAllCredenciaisEmpresa,
    getCredencialEmpresaById,
    updateCredencialEmpresa,
    deleteCredencialEmpresa
};
