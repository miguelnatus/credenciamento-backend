const bcrypt = require('bcrypt');
const db = require('../db/db');

async function createEvent(req, res) {
    const { produtora_id, grupo_id, nome, local, imagem, data_do_evento, inicio_do_credenciamento, fim_do_credenciamento, descricao } = req.body;
    
    try {
        const [newEventId] = await db('eventos').insert({
            produtora_id,
            grupo_id,
            nome,
            local,
            imagem,
            data_do_evento,
            inicio_do_credenciamento,
            fim_do_credenciamento,
            descricao,
            created_at: new Date(),
            updated_at: new Date()
        });
        
        res.status(201).json({ message: 'Evento criado com sucesso', event_id: newEventId });
    } catch (error) {
        console.error("Erro ao criar evento:", error);
        res.status(500).json({ error: 'Erro ao criar o evento' });
    }
}

// Função para listar eventos
async function getAllEvents(req, res) {
    const { produtora_id, grupo_id } = req.query; // Suporta filtros opcionais

    try {
        const query = db('eventos').whereNull('deleted_at');

        if (produtora_id) {
            query.andWhere({ produtora_id });
        }

        if (grupo_id) {
            query.andWhere({ grupo_id });
        }

        const events = await query;
        res.json(events);
    } catch (error) {
        console.error("Erro ao buscar eventos:", error);
        res.status(500).json({ error: 'Erro ao buscar eventos' });
    }
}

// Função para obter um evento específico
async function getEventById(req, res) {
    const { id } = req.params;

    try {
        const event = await db('eventos').where({ id }).whereNull('deleted_at').first();

        if (!event) {
            return res.status(404).json({ message: 'Evento não encontrado' });
        }

        res.json(event);
    } catch (error) {
        console.error("Erro ao buscar evento:", error);
        res.status(500).json({ error: 'Erro ao buscar evento' });
    }
}

// Função para atualizar um evento
async function updateEvent(req, res) {
    const { id } = req.params;
    const { produtora_id, grupo_id, nome, local, imagem, data_do_evento, inicio_do_credenciamento, fim_do_credenciamento, descricao } = req.body;

    try {
        const updated = await db('eventos')
            .where({ id })
            .update({
                produtora_id,
                grupo_id,
                nome,
                local,
                imagem,
                data_do_evento,
                inicio_do_credenciamento,
                fim_do_credenciamento,
                descricao,
                updated_at: new Date()
            });

        if (!updated) {
            return res.status(404).json({ message: 'Evento não encontrado para atualização' });
        }

        res.json({ message: 'Evento atualizado com sucesso' });
    } catch (error) {
        console.error("Erro ao atualizar evento:", error);
        res.status(500).json({ error: 'Erro ao atualizar o evento' });
    }
}

// Função para excluir um evento
async function deleteEvent(req, res) {
    const { id } = req.params;

    try {
        const deleted = await db('eventos').where({ id }).update({ deleted_at: new Date() });

        if (!deleted) {
            return res.status(404).json({ message: 'Evento não encontrado para exclusão' });
        }

        res.json({ message: 'Evento excluído com sucesso' });
    } catch (error) {
        console.error("Erro ao excluir evento:", error);
        res.status(500).json({ error: 'Erro ao excluir o evento' });
    }
}

module.exports = {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent
};