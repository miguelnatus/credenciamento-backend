import prisma from '../db/db.js'; // Configuração do Prisma

// Função para criar um evento
async function createEvent(req, res) {
    const { grupo_id, nome, local, data_evento, inicio_credenciamento, fim_credenciamento, descricao } = req.body;

    try {
        const newEvent = await prisma.eventos.create({
            data: {
                grupo_id,
                nome,
                local,
                data_evento,
                inicio_credenciamento,
                fim_credenciamento,
                descricao,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });

        res.status(201).json({ message: 'Evento criado com sucesso', event_id: newEvent.id });
    } catch (error) {
        console.error("Erro ao criar evento:", error);
        res.status(500).json({ error: 'Erro ao criar o evento' });
    }
}

// Função para listar eventos
async function getAllEvents(req, res) {
    const { grupo_id } = req.query; // Suporta filtros opcionais

    try {
        const events = await prisma.eventos.findMany({
            where: {
                deleted_at: null,
                grupo_id: grupo_id || undefined,
            },
        });

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
        const event = await prisma.eventos.findUnique({
            where: { id },
            select: {
                id: true,
                grupo_id: true,
                nome: true,
                local: true,
                data_evento: true,
                inicio_credenciamento: true,
                fim_credenciamento: true,
                descricao: true,
            }
        });

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
    const { grupo_id, nome, local, data_evento, inicio_credenciamento, fim_credenciamento, descricao } = req.body;

    try {
        const updatedEvent = await prisma.eventos.update({
            where: { id },
            data: {
                grupo_id,
                nome,
                local,
                data_evento,
                inicio_credenciamento,
                fim_credenciamento,
                descricao,
                updated_at: new Date(),
            },
        });

        res.json({ message: 'Evento atualizado com sucesso' });
    } catch (error) {
        console.error("Erro ao atualizar evento:", error);
        res.status(500).json({ error: 'Erro ao atualizar o evento' });
    }
}

// Função para excluir um evento (soft delete)
async function deleteEvent(req, res) {
    const { id } = req.params;

    try {
        const deletedEvent = await prisma.eventos.update({
            where: { id },
            data: { deleted_at: new Date() },
        });

        res.json({ message: 'Evento excluído com sucesso' });
    } catch (error) {
        console.error("Erro ao excluir evento:", error);
        res.status(500).json({ error: 'Erro ao excluir o evento' });
    }
}

export {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent
};
