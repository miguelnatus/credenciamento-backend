import prisma from '../db/db.js'; // Prisma Client
import Joi from 'joi';

// Esquema de Validação para Credencial de Empresa
const credencialEmpresaSchema = Joi.object({
    empresa_id: Joi.number().required(),
    evento_id: Joi.number().required(),
    setor_id: Joi.number().required(),
    limite_pessoas: Joi.number().min(0).required(),
    limite_veiculos: Joi.number().min(0).optional(),
});

// Função para criar novas credenciais de empresa
export const createCredencialEmpresa = async (req, res) => {
    try {
        const credenciais = req.body;

        if (!Array.isArray(credenciais)) {
            return res.status(400).json({ error: 'Os dados devem ser um array de credenciais' });
        }

        const validCredenciais = [];
        for (const credencial of credenciais) {
            const { error, value } = credencialEmpresaSchema.validate(credencial);
            if (error) {
                return res.status(400).json({ error: `Erro na validação: ${error.details[0].message}` });
            }
            validCredenciais.push(value);
        }

        const resultados = await Promise.all(
            validCredenciais.map(async (credencial) => {
                const { empresa_id, evento_id, setor_id, limite_pessoas, limite_veiculos = 0 } = credencial;

                const novaCredencial = await prisma.credencial_empresa_setor.create({
                    data: {
                        empresa_id,
                        evento_id,
                        setor_id,
                        limite_pessoas,
                        limite_veiculos,
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                });

                return novaCredencial.id;
            })
        );

        res.status(201).json({
            ids: resultados,
            message: 'Credenciais de empresa criadas com sucesso',
        });
    } catch (error) {
        console.error('Erro ao criar credenciais de empresa:', error);
        res.status(500).json({ error: 'Erro ao criar credenciais de empresa' });
    }
};

// Função para obter todas as credenciais de empresa
export const getAllCredenciaisEmpresa = async (req, res) => {
    try {
        const credenciais = await prisma.credencial_empresa_setor.findMany({
            where: { deleted_at: null },
            include: {
                empresas: { select: { nome: true } },
                eventos: { select: { nome: true } },
                setores: { select: { nome: true } },
            },
        });

        res.json(credenciais);
    } catch (error) {
        console.error('Erro ao buscar todas as credenciais de empresa:', error);
        res.status(500).json({ error: 'Erro ao buscar todas as credenciais de empresa' });
    }
};

// Função para buscar credenciais de empresa por filtros
export const searchCredenciaisEmpresa = async (req, res) => {
    const { empresa_id, evento_id } = req.params;

    if (!empresa_id && !evento_id) {
        return res.status(400).json({ error: 'É necessário informar pelo menos um filtro de busca' });
    }

    try {
        const credenciais = await prisma.credencial_empresa_setor.findMany({
            where: {
                ...(empresa_id && { empresa_id: parseInt(empresa_id) }),
                ...(evento_id && { evento_id: parseInt(evento_id) }),
                deleted_at: null,
            },
            include: {
                empresas: { select: { nome: true } },
                eventos: { select: { nome: true } },
                setores: { select: { nome: true } },
            },
        });

        res.json(credenciais);
    } catch (error) {
        console.error('Erro ao buscar credenciais de empresa:', error);
        res.status(500).json({ error: 'Erro ao buscar credenciais de empresa' });
    }
};

// Função para atualizar credenciais de empresa
export const updateCredencialEmpresa = async (req, res) => {
    const credenciais = req.body;

    if (!Array.isArray(credenciais)) {
        return res.status(400).json({ error: 'Os dados devem ser um array de credenciais' });
    }

    try {
        const resultados = await Promise.all(
            credenciais.map(async (credencial) => {
                const { empresa_id, evento_id, setor_id, limite_pessoas, limite_veiculos = 0 } = credencial;

                const credencialExistente = await prisma.credencial_empresa_setor.findFirst({
                    where: { empresa_id, evento_id, setor_id, deleted_at: null },
                });

                if (credencialExistente) {
                    return prisma.credencial_empresa_setor.update({
                        where: { id: credencialExistente.id },
                        data: {
                            limite_pessoas,
                            limite_veiculos,
                            updated_at: new Date(),
                        },
                    });
                } else {
                    return prisma.credencial_empresa_setor.create({
                        data: {
                            empresa_id,
                            evento_id,
                            setor_id,
                            limite_pessoas,
                            limite_veiculos,
                            created_at: new Date(),
                            updated_at: new Date(),
                        },
                    });
                }
            })
        );

        res.json({
            message: 'Credenciais de empresa atualizadas com sucesso',
            resultados,
        });
    } catch (error) {
        console.error('Erro ao atualizar credenciais de empresa:', error);
        res.status(500).json({ error: 'Erro ao atualizar credenciais de empresa' });
    }
};

// Função para deletar credencial de empresa pelo ID (soft delete)
export const deleteCredencialEmpresa = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.credencial_empresa_setor.update({
            where: { id: parseInt(id) },
            data: { deleted_at: new Date() },
        });

        res.json({ message: 'Credencial de empresa deletada com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar credencial de empresa:', error);
        res.status(500).json({ error: 'Erro ao deletar credencial de empresa' });
    }
};

export const mostraSetoresDisponiveis = async (req, res) => {
    const { empresa_id, evento_id } = req.params;

    try {
        const setores = await prisma.credencial_empresa_setor.findMany({
            where: {
                empresa_id,
                evento_id,
            },
            include: {
                setores: true,
            },
        });

        res.json(setores);
    } catch (error) {
        console.error("Erro ao buscar setores:", error);
        res.status(500).json({ error: 'Erro ao buscar setores disponíveis' });
    }
};
