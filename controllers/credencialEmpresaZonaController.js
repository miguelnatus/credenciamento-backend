const db = require('../db/db');

// Função para criar uma nova credencial de empresa zona
async function createCredencialEmpresaZonas(req, res) {
    try {
        const zonas = req.body;
        console.log("Dados recebidos:", zonas);

        if (!Array.isArray(zonas)) {
            return res.status(400).json({ error: 'Os dados devem ser um array de zonas' });
        }

        const resultados = await Promise.all(
            zonas.map(async (zona) => {
                const { ces_id, zona_id, limite } = zona;

                if (!ces_id || !zona_id || !limite) {
                    throw new Error('Dados incompletos para uma ou mais zonas');
                }

                const [id] = await db('credencial_empresa_zona').insert({
                    ces_id,
                    zona_id,
                    limite,
                    created_at: new Date(),
                    updated_at: new Date()
                });

                return id;
            })
        );

        res.status(201).json({ 
            ids: resultados,
            message: 'Zonas criadas com sucesso'
        });

    } catch (error) {
        console.error("Erro ao criar zonas:", error);
        res.status(500).json({ error: 'Erro ao criar zonas: ' + error.message });
    }
}

// Função para obter todas as zonas
async function getAllCredenciaisEmpresaZonas(req, res) {
    try {
        const query = db('credencial_empresa_zona')
            .select('*')
            .whereNull('deleted_at');

        const zonas = await query;

        res.json(zonas);
    } catch (error) {
        console.error("Erro ao buscar todas as zonas:", error);
        res.status(500).json({ error: 'Erro ao buscar todas as zonas' });
    }
}

// Função para buscar zonas por credencial
async function searchCredenciaisEmpresaZonas(req, res) {
    console.log("Dados recebidos:", req.params);
    try {
        const { ces_id } = req.params;
        
        if (!ces_id) {
            return res.status(400).json({ error: 'É necessário informar o ID da credencial' });
        }

        const query = db('credencial_empresa_zona')
            .select('*')
            .where('ces_id', ces_id)
            .whereNull('deleted_at');

        const zonas = await query;

        res.json(zonas);
    } catch (error) {
        console.error("Erro ao buscar zonas:", error);
        res.status(500).json({ error: 'Erro ao buscar zonas' });
    }
}

// Função para atualizar uma zona pelo ID
async function updateCredencialEmpresaZonas(req, res) {
    const { id } = req.params;
    const zona = req.body;

    try {
        const updated = await db('credencial_empresa_zona')
            .where({ id })
            .update({
                zona_id: zona.zona_id,
                limite: zona.limite,
                updated_at: new Date()
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

// Função para deletar uma zona pelo ID (soft delete)
async function deleteCredencialEmpresaZonas(req, res) {
    const { id } = req.params;

    try {
        const deleted = await db('credencial_empresa_zona')
            .where({ id })
            .whereNull('deleted_at')
            .update({
                deleted_at: new Date()
            });

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
    createCredencialEmpresaZonas,
    getAllCredenciaisEmpresaZonas,
    searchCredenciaisEmpresaZonas,
    updateCredencialEmpresaZonas,
    deleteCredencialEmpresaZonas
};
