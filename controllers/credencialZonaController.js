import prisma from '../db/db.js'; // Prisma Client
import Joi from 'joi';

// Esquema de validação para Credencial Zona
export const credencialZonaSchema = Joi.object({
    credencial_id: Joi.number().required(),
    zona_id: Joi.number().required(),
});

// Função para criar uma nova credencial zona
export const createCredencialZona = async (req, res) => {
    // Validação dos dados recebidos
    const { error, value } = credencialZonaSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const novaCredencialZona = await prisma.credencial_zona.create({
            data: {
                ...value,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });

        res.status(201).json({
            id: novaCredencialZona.id,
            message: 'Credencial zona criada com sucesso',
        });
    } catch (error) {
        console.error("Erro ao criar credencial zona:", error);
        res.status(500).json({ error: 'Erro ao criar credencial zona' });
    }
};

// Função para obter todas as credenciais zonas
export const getAllCredenciaisZonas = async (req, res) => {
    try {
        const credenciaisZonas = await prisma.credencial_zona.findMany({
            where: { deleted_at: null },
        });
        res.json(credenciaisZonas);
    } catch (error) {
        console.error("Erro ao buscar credenciais zonas:", error);
        res.status(500).json({ error: 'Erro ao buscar credenciais zonas' });
    }
};

// Função para obter zonas por ID da credencial
export const getZonasByCredencialId = async (req, res) => {
    const { credencial_id } = req.params;

    try {
        const zonas = await prisma.credencial_zona.findMany({
            where: { credencial_id: parseInt(credencial_id), deleted_at: null },
        });

        res.json(zonas);
    } catch (error) {
        console.error("Erro ao buscar zonas da credencial:", error);
        res.status(500).json({ error: 'Erro ao buscar zonas da credencial' });
    }
};

// Função para atualizar uma credencial zona
export const updateCredencialZona = async (req, res) => {
    const { id } = req.params;

    // Validação dos dados recebidos
    const { error, value } = credencialZonaSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const updatedCredencialZona = await prisma.credencial_zona.update({
            where: { id: parseInt(id) },
            data: {
                ...value,
                updated_at: new Date(),
            },
        });

        res.json({ message: 'Credencial zona atualizada com sucesso' });
    } catch (error) {
        console.error("Erro ao atualizar credencial zona:", error);
        res.status(500).json({ error: 'Erro ao atualizar credencial zona' });
    }
};

// Função para deletar uma credencial zona (soft delete)
export const deleteCredencialZona = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await prisma.credencial_zona.update({
            where: { id: parseInt(id) },
            data: { deleted_at: new Date() },
        });

        res.json({ message: 'Credencial zona deletada com sucesso' });
    } catch (error) {
        console.error("Erro ao deletar credencial zona:", error);
        res.status(500).json({ error: 'Erro ao deletar credencial zona' });
    }
};
