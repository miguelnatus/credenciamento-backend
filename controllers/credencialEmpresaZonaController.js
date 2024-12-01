import prisma from '../db/db.js'; // Prisma Client

// Função para criar uma nova credencial de empresa zona
export const createCredencialEmpresaZonas = async (req, res) => {
    try {
        const zonas = req.body;
        console.log("Dados recebidos:", zonas);

        if (!Array.isArray(zonas)) {
            return res.status(400).json({ error: 'Os dados devem ser um array de zonas' });
        }

        // Processa cada zona do array
        const resultados = await Promise.all(
            zonas.map(async (zona) => {
                const { ces_id, zona_id, limite } = zona;

                if (!ces_id || !zona_id) {
                    throw new Error('Dados incompletos para uma ou mais zonas');
                }

                // Verifica se já existe um registro para essa combinação ces_id/zona_id
                const existente = await prisma.credencial_empresa_zona.findFirst({
                    where: { ces_id, zona_id },
                });

                // Se limite for zero ou nulo, deleta o registro se existir
                if (!limite || limite === 0) {
                    if (existente) {
                        await prisma.credencial_empresa_zona.delete({
                            where: { id: existente.id },
                        });
                        return { acao: 'deletado', ces_id, zona_id };
                    }
                    return { acao: 'ignorado', ces_id, zona_id };
                }

                // Atualiza ou cria novo registro
                if (existente) {
                    // Update
                    await prisma.credencial_empresa_zona.update({
                        where: { id: existente.id },
                        data: { limite, updated_at: new Date() },
                    });
                    return { acao: 'atualizado', id: existente.id, ces_id, zona_id };
                } else {
                    // Insert
                    const novaCredencial = await prisma.credencial_empresa_zona.create({
                        data: {
                            ces_id,
                            zona_id,
                            limite,
                            created_at: new Date(),
                            updated_at: new Date(),
                        },
                    });
                    return { acao: 'criado', id: novaCredencial.id, ces_id, zona_id };
                }
            })
        );

        res.status(200).json({
            resultados,
            message: 'Zonas processadas com sucesso',
        });
    } catch (error) {
        console.error("Erro ao processar zonas:", error);
        res.status(500).json({ error: 'Erro ao processar zonas: ' + error.message });
    }
};

// Função para obter todas as zonas
export const getAllCredenciaisEmpresaZonas = async (req, res) => {
    try {
        const zonas = await prisma.credencial_empresa_zona.findMany({
            where: { deleted_at: null },
        });

        res.json(zonas);
    } catch (error) {
        console.error("Erro ao buscar todas as zonas:", error);
        res.status(500).json({ error: 'Erro ao buscar todas as zonas' });
    }
};

// Função para buscar zonas por credencial
export const searchCredenciaisEmpresaZonas = async (req, res) => {
    console.log("Dados recebidos:", req.params);
    try {
        const { ces_id } = req.params;

        if (!ces_id) {
            return res.status(400).json({ error: 'É necessário informar o ID da credencial' });
        }

        const zonas = await prisma.credencial_empresa_zona.findMany({
            where: { ces_id, deleted_at: null },
        });

        res.json(zonas);
    } catch (error) {
        console.error("Erro ao buscar zonas:", error);
        res.status(500).json({ error: 'Erro ao buscar zonas' });
    }
};

// Função para atualizar uma zona pelo ID
export const updateCredencialEmpresaZonas = async (req, res) => {
    const { id } = req.params;
    const zona = req.body;

    try {
        const updated = await prisma.credencial_empresa_zona.update({
            where: { id: parseInt(id) },
            data: {
                zona_id: zona.zona_id,
                limite: zona.limite,
                updated_at: new Date(),
            },
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
};

// Função para deletar uma zona pelo ID (soft delete)
export const deleteCredencialEmpresaZonas = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await prisma.credencial_empresa_zona.update({
            where: { id: parseInt(id) },
            data: { deleted_at: new Date() },
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
};

// Função para buscar zonas disponíveis para uma empresa, evento e setor
export const mostraZonasDisponiveis = async (req, res) => {
    console.log("Dados recebidos:", req.params);
    const { ces_id } = req.params;

    try {
        const zonas = await prisma.credencial_empresa_zona.findMany({
            where: { ces_id },
            include: {
                zonas: true, // Incluir dados das zonas
            },
        });

        res.json(zonas);
    } catch (error) {
        console.error("Erro ao buscar zonas:", error);
        res.status(500).json({ error: 'Erro ao buscar zonas disponíveis' });
    }
};
