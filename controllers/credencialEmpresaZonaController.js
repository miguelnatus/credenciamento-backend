const db = require('../db/db');

// Função para criar uma nova credencial de empresa zona
async function createCredencialEmpresaZonas(req, res) {
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
                const existente = await db('credencial_empresa_zona')
                    .where({ 
                        ces_id: ces_id,
                        zona_id: zona_id
                    })
                    .first();

                // Se limite for zero ou nulo, deleta o registro se existir
                if (!limite || limite === 0) {
                    if (existente) {
                        await db('credencial_empresa_zona')
                            .where({ 
                                ces_id: ces_id,
                                zona_id: zona_id 
                            })
                            .delete();
                        return { acao: 'deletado', ces_id, zona_id };
                    }
                    return { acao: 'ignorado', ces_id, zona_id };
                }

                // Atualiza ou cria novo registro
                if (existente) {
                    // Update
                    await db('credencial_empresa_zona')
                        .where({ 
                            ces_id: ces_id,
                            zona_id: zona_id
                        })
                        .update({
                            limite: limite,
                            updated_at: new Date()
                        });
                    return { acao: 'atualizado', id: existente.id, ces_id, zona_id };
                } else {
                    // Insert
                    const [id] = await db('credencial_empresa_zona').insert({
                        ces_id,
                        zona_id,
                        limite,
                        created_at: new Date(),
                        updated_at: new Date()
                    });
                    return { acao: 'criado', id, ces_id, zona_id };
                }
            })
        );

        res.status(200).json({ 
            resultados,
            message: 'Zonas processadas com sucesso'
        });

    } catch (error) {
        console.error("Erro ao processar zonas:", error);
        res.status(500).json({ error: 'Erro ao processar zonas: ' + error.message });
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

// Função para buscar zonas disponíveis para uma empresa, evento e setor
async function mostraZonasDisponiveis(req, res) {
    console.log("Dados recebidos:", req.params);
    const { ces_id } = req.params;
    
    try {
        const zonas = await db('credencial_empresa_zona')
            .select('zonas.id', 'zonas.nome', 'credencial_empresa_zona.id as ces_id') 
            .join('zonas', 'credencial_empresa_zona.zona_id', '=', 'zonas.id')
            .where('credencial_empresa_zona.ces_id', ces_id)
            .whereNull('credencial_empresa_zona.deleted_at');

        res.json(zonas);
    } catch (error) {
        console.error("Erro ao buscar zonas:", error);
        res.status(500).json({ error: 'Erro ao buscar zonas disponíveis' });
    }
}

module.exports = {
    createCredencialEmpresaZonas,
    getAllCredenciaisEmpresaZonas,
    searchCredenciaisEmpresaZonas,
    updateCredencialEmpresaZonas,
    deleteCredencialEmpresaZonas,
    mostraZonasDisponiveis
};
