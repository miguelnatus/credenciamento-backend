const db = require('../db/db');

// Função para criar uma nova credencial zona
async function createCredencialZona(req, res) {
    const { credencial_id, zona_id } = req.body;

    try {
        const [id] = await db('credencial_zona').insert({
            credencial_id,
            zona_id,
            created_at: db.fn.now(),
            updated_at: db.fn.now()
        });

        res.status(201).json({ id, message: 'Credencial zona criada com sucesso' });
    } catch (error) {
        console.error("Erro ao criar credencial zona:", error);
        res.status(500).json({ error: 'Erro ao criar credencial zona' });
    }
}

// Função para obter todas as credenciais zonas
async function getAllCredenciaisZonas(req, res) {
    try {
        const credenciaisZonas = await db('credencial_zona')
            .whereNull('deleted_at');
        res.json(credenciaisZonas);
    } catch (error) {
        console.error("Erro ao buscar credenciais zonas:", error);
        res.status(500).json({ error: 'Erro ao buscar credenciais zonas' });
    }
}

// Função para obter zonas por ID da credencial
async function getZonasByCredencialId(req, res) {
    const { credencial_id } = req.params;
    try {
        const zonas = await db('credencial_zona')
            .where({ credencial_id })
            .whereNull('deleted_at');
        res.json(zonas);
    } catch (error) {
        console.error("Erro ao buscar zonas da credencial:", error);
        res.status(500).json({ error: 'Erro ao buscar zonas da credencial' });
    }
}

// Função para atualizar uma credencial zona
async function updateCredencialZona(req, res) {
    const { id } = req.params;
    const { credencial_id, zona_id } = req.body;

    try {
        await db('credencial_zona')
            .where({ id })
            .update({
                credencial_id,
                zona_id,
                updated_at: db.fn.now()
            });

        res.json({ message: 'Credencial zona atualizada com sucesso' });
    } catch (error) {
        console.error("Erro ao atualizar credencial zona:", error);
        res.status(500).json({ error: 'Erro ao atualizar credencial zona' });
    }
}

// Função para deletar uma credencial zona
async function deleteCredencialZona(req, res) {
    const { id } = req.params;

    try {
        await db('credencial_zona')
            .where({ id })
            .update({
                deleted_at: db.fn.now()
            });

        res.json({ message: 'Credencial zona deletada com sucesso' });
    } catch (error) {
        console.error("Erro ao deletar credencial zona:", error);
        res.status(500).json({ error: 'Erro ao deletar credencial zona' });
    }
}

module.exports = {
    createCredencialZona,
    getAllCredenciaisZonas,
    getZonasByCredencialId,
    updateCredencialZona,
    deleteCredencialZona
};
