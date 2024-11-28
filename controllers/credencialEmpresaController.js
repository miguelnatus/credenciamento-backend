const db = require('../db/db');

// Função para criar uma nova credencial de empresa
async function createCredencialEmpresa(req, res) {
    try {
        const credenciais = req.body;
        console.log("Dados recebidos:", credenciais);

        if (!Array.isArray(credenciais)) {
            return res.status(400).json({ error: 'Os dados devem ser um array de credenciais' });
        }

        const resultados = await Promise.all(
            credenciais.map(async (credencial) => {
                const { empresa_id, evento_id, setor_id, limite_pessoas, limite_veiculos } = credencial;

                if (!empresa_id || !evento_id || !setor_id || !limite_pessoas) {
                    throw new Error('Dados incompletos para uma ou mais credenciais');
                }

                const [id] = await db('credencial_empresa_setor').insert({
                    empresa_id,
                    evento_id, 
                    setor_id,
                    limite_pessoas,
                    limite_veiculos: limite_veiculos || 0,
                    created_at: new Date(),
                    updated_at: new Date()
                });

                return id;
            })
        );

        res.status(201).json({ 
            ids: resultados,
            message: 'Credenciais de empresa criadas com sucesso'
        });

    } catch (error) {
        console.error("Erro ao criar credenciais de empresa:", error);
        res.status(500).json({ error: 'Erro ao criar credenciais de empresa: ' + error.message });
    }
}

// Função para obter todas as credenciais de empresa
async function getAllCredenciaisEmpresa(req, res) {
    try {
        const query = db('credencial_empresa_setor')
            .select(
                'credencial_empresa_setor.*',
                'empresas.nome as empresa_nome', 
                'eventos.nome as evento_nome',
                'setores.nome as setor_nome'
            )
            .leftJoin('empresas', 'credencial_empresa_setor.empresa_id', 'empresas.id')
            .leftJoin('eventos', 'credencial_empresa_setor.evento_id', 'eventos.id')
            .leftJoin('setores', 'credencial_empresa_setor.setor_id', 'setores.id')
            .whereNull('credencial_empresa_setor.deleted_at');

        const credenciais = await query;

        res.json(credenciais);
    } catch (error) {
        console.error("Erro ao buscar todas as credenciais de empresa:", error);
        res.status(500).json({ error: 'Erro ao buscar todas as credenciais de empresa' });
    }
}

// Função para buscar credenciais de empresa por filtros
async function searchCredenciaisEmpresa(req, res) {
    console.log("Dados recebidos:", req.params);
    try {
        const { empresa_id, evento_id } = req.params;
        
        if (!empresa_id && !evento_id) {
            return res.status(400).json({ error: 'É necessário informar pelo menos um filtro de busca' });
        }

        const query = db('credencial_empresa_setor')
            .select(
                'credencial_empresa_setor.*',
                'empresas.nome as empresa_nome',
                'eventos.nome as evento_nome',
                'setores.nome as setor_nome'
            )
            .leftJoin('empresas', 'credencial_empresa_setor.empresa_id', 'empresas.id')
            .leftJoin('eventos', 'credencial_empresa_setor.evento_id', 'eventos.id')
            .leftJoin('setores', 'credencial_empresa_setor.setor_id', 'setores.id')
            .whereNull('credencial_empresa_setor.deleted_at');

        if (empresa_id) {
            query.where('credencial_empresa_setor.empresa_id', empresa_id);
        }

        if (evento_id) {
            query.where('credencial_empresa_setor.evento_id', evento_id);
        }

        const credenciais = await query;

        res.json(credenciais);
    } catch (error) {
        console.error("Erro ao buscar credenciais de empresa:", error);
        res.status(500).json({ error: 'Erro ao buscar credenciais de empresa' });
    }
}


// Função para atualizar uma credencial de empresa pelo ID
async function updateCredencialEmpresa(req, res) {
    console.log("Dados recebidos:", req.body);
    const credenciais = req.body;

    try {
        // Verifica se credenciais é um array
        if (!Array.isArray(credenciais)) {
            return res.status(400).json({ error: 'O corpo da requisição deve ser um array de credenciais' });
        }

        // Busca todas as credenciais existentes para essa empresa
        const empresa_id = credenciais[0]?.empresa_id;
        const evento_id = credenciais[0]?.evento_id;
        
        const existingCredenciais = await db('credencial_empresa_setor')
            .where({ empresa_id, evento_id })
            .whereNull('deleted_at');

        // Identifica credenciais que não estão mais presentes no update
        const credenciaisAtualizadas = new Set(credenciais.map(c => c.setor_id));
        const credenciaisParaDeletar = existingCredenciais.filter(
            ec => !credenciaisAtualizadas.has(ec.setor_id)
        );

        // Deleta credenciais que não estão mais presentes
        await Promise.all(
            credenciaisParaDeletar.map(async (credencial) => {
                await db('credencial_empresa_setor')
                    .where({ id: credencial.id })
                    .update({ deleted_at: new Date() });
            })
        );

        // Atualiza, cria ou deleta cada credencial
        const resultados = await Promise.all(
            credenciais.map(async (credencial) => {
                const { empresa_id, evento_id, setor_id, limite_pessoas, limite_veiculos } = credencial;

                // Se limite_pessoas for 0, deleta a credencial
                if (limite_pessoas === 0) {
                    const existingCredencial = await db('credencial_empresa_setor')
                        .where({ empresa_id, evento_id, setor_id })
                        .whereNull('deleted_at')
                        .first();

                    if (existingCredencial) {
                        await db('credencial_empresa_setor')
                            .where({ id: existingCredencial.id })
                            .update({ deleted_at: new Date() });
                        return existingCredencial.id;
                    }
                    return null;
                }

                // Busca a credencial existente
                const existingCredencial = await db('credencial_empresa_setor')
                    .where({ empresa_id, evento_id, setor_id })
                    .whereNull('deleted_at')
                    .first();

                if (!existingCredencial) {
                    // Se não existe, cria uma nova credencial
                    const [id] = await db('credencial_empresa_setor')
                        .insert({
                            empresa_id,
                            evento_id,
                            setor_id,
                            limite_pessoas,
                            limite_veiculos,
                            created_at: new Date(),
                            updated_at: new Date()
                        });
                    return id;
                }

                // Atualiza a credencial existente
                const updated = await db('credencial_empresa_setor')
                    .where({ id: existingCredencial.id })
                    .update({
                        limite_pessoas,
                        limite_veiculos,
                        updated_at: new Date()
                    });

                if (!updated) {
                    throw new Error(`Erro ao atualizar credencial ${existingCredencial.id}`);
                }

                return existingCredencial.id;
            })
        );

        res.json({ 
            ids: resultados.filter(id => id !== null),
            message: 'Credenciais de empresa atualizadas com sucesso'
        });

    } catch (error) {
        console.error("Erro ao atualizar credenciais de empresa:", error);
        res.status(500).json({ error: 'Erro ao atualizar credenciais de empresa: ' + error.message });
    }
}

// Função para deletar uma credencial de empresa pelo ID (soft delete)
async function deleteCredencialEmpresa(req, res) {
    const { id } = req.params;
    const { empresa_id, evento_id } = req.query;

    console.log("ID recebido:", id);
    console.log("Empresa ID:", empresa_id);
    console.log("Evento ID:", evento_id);

    try {
        const deleted = await db('credencial_empresa_setor')
            .where({ 
                empresa_id,
                evento_id
            })
            .whereNull('deleted_at')
            .update({
                deleted_at: new Date()
            });

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

// Função para mostrar os setores disponíveis para credenciar
async function mostraSetoresDisponiveis(req, res) {
    console.log("Dados recebidos:", req.params);
    const { empresa_id, evento_id } = req.params;
    
    try {
        const setores = await db('credencial_empresa_setor')
            .select('credencial_empresa_setor.id as ces_id', 'setores.nome', 'setores.id as setor_id')
            .join('setores', 'credencial_empresa_setor.setor_id', '=', 'setores.id')
            .where({
                'credencial_empresa_setor.empresa_id': empresa_id,
                'credencial_empresa_setor.evento_id': evento_id
            })
            .whereNull('credencial_empresa_setor.deleted_at');

        res.json(setores);
    } catch (error) {
        console.error("Erro ao buscar setores:", error);
        res.status(500).json({ error: 'Erro ao buscar setores disponíveis' });
    }
}

module.exports = {
    createCredencialEmpresa,
    getAllCredenciaisEmpresa,
    searchCredenciaisEmpresa,
    updateCredencialEmpresa,
    deleteCredencialEmpresa,
    mostraSetoresDisponiveis
};
