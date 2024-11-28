const db = require('../db/db');

// Função para obter todas as credenciais
async function getAllCredenciais(req, res) {
    try {
        const credenciais = await db('credenciais');
        res.json(credenciais);
    } catch (error) {
        console.error("Erro ao buscar credenciais:", error);
        res.status(500).json({ error: 'Erro ao buscar credenciais' });
    }
}

// Função para criar uma nova credencial
async function createCredencial(req, res) {
    const { pessoa_id, veiculo_id, evento_id, empresa_id, setor_id, status_id, zonas } = req.body;

    try {
        // Verifica se já existe uma credencial para essa pessoa/evento
        const credencialExistente = await db('credenciais')
            .where({ 
                pessoa_id,
                evento_id 
            })
            .first();

        let id;
        
        if (credencialExistente) {
            // Atualiza a credencial existente
            await db('credenciais')
                .where({ id: credencialExistente.id })
                .update({
                    veiculo_id,
                    empresa_id,
                    setor_id,
                    status_id,
                    updated_at: db.fn.now()
                });
                
            id = credencialExistente.id;
            
            // Atualiza as zonas
            if (zonas) {
                // Remove zonas antigas
                await db('credencial_zona').where({ credencial_id: id }).del();
                
                // Insere novas zonas
                if (zonas.length > 0) {
                    const zonasParaInserir = zonas.map(zona_id => ({
                        credencial_id: id,
                        zona_id
                    }));
                    await db('credencial_zona').insert(zonasParaInserir);
                }
            }
            
            res.json({ id, message: 'Credencial atualizada com sucesso' });
            
        } else {
            // Cria nova credencial
            [id] = await db('credenciais').insert({
                pessoa_id,
                veiculo_id,
                evento_id,
                empresa_id,
                setor_id,
                status_id,
                created_at: db.fn.now(),
                updated_at: db.fn.now()
            });

            // Insere as zonas se fornecidas
            if (zonas && zonas.length > 0) {
                const zonasParaInserir = zonas.map(zona_id => ({
                    credencial_id: id,
                    zona_id
                }));
                await db('credencial_zonas').insert(zonasParaInserir);
            }

            res.status(201).json({ id, message: 'Credencial criada com sucesso' });
        }

    } catch (error) {
        console.error("Erro ao criar/atualizar credencial:", error);
        res.status(500).json({ error: 'Erro ao criar/atualizar credencial' });
    }
}

// Função para obter uma credencial pelo ID
async function getCredencialById(req, res) {
    const { id } = req.params;

    try {
        const credencial = await db('credenciais').where({ id }).first();
        if (credencial) {
            res.json(credencial);
        } else {
            res.status(404).json({ error: 'Credencial não encontrada' });
        }
    } catch (error) {
        console.error("Erro ao buscar credencial:", error);
        res.status(500).json({ error: 'Erro ao buscar credencial' });
    }
}

// Função para atualizar uma credencial pelo ID
async function updateCredencial(req, res) {
    const { id } = req.params;
    const { pessoa_id, veiculo_id, evento_id, empresa_id, setor_id, status_id } = req.body;

    try {
        const updated = await db('credenciais').where({ id }).update({
            pessoa_id,
            veiculo_id,
            evento_id,
            empresa_id,
            setor_id,
            status_id
        });

        if (updated) {
            res.json({ message: 'Credencial atualizada com sucesso' });
        } else {
            res.status(404).json({ error: 'Credencial não encontrada' });
        }
    } catch (error) {
        console.error("Erro ao atualizar credencial:", error);
        res.status(500).json({ error: 'Erro ao atualizar credencial' });
    }
}

// Função para deletar uma credencial pelo ID
async function deleteCredencial(req, res) {
    const { id } = req.params;

    try {
        const deleted = await db('credenciais').where({ id }).del();

        if (deleted) {
            res.json({ message: 'Credencial deletada com sucesso' });
        } else {
            res.status(404).json({ error: 'Credencial não encontrada' });
        }
    } catch (error) {
        console.error("Erro ao deletar credencial:", error);
        res.status(500).json({ error: 'Erro ao deletar credencial' });
    }
}

// Função para obter uma credencial pelo ID da pessoa e ID do evento
async function getCredencialByPessoaId(req, res) {
    const { id, evento_id } = req.params;
    try {
        const credencial = await db('credenciais')
            .select('credenciais.*', 'credencial_empresa_setor.id as ces_id')
            .leftJoin('credencial_empresa_setor', function() {
                this.on('credenciais.setor_id', '=', 'credencial_empresa_setor.setor_id')
                    .andOn('credenciais.empresa_id', '=', 'credencial_empresa_setor.empresa_id')
                    .andOn('credenciais.evento_id', '=', 'credencial_empresa_setor.evento_id')
                    .andOnNull('credencial_empresa_setor.deleted_at');
            })
            .where({ 
                'credenciais.pessoa_id': id, 
                'credenciais.evento_id': evento_id 
            })
            .whereNull('credenciais.deleted_at')
            .first();
        res.json(credencial);
    } catch (error) {
        console.error("Erro ao buscar credencial:", error);
        res.status(500).json({ error: 'Erro ao buscar credencial' });
    }
}

module.exports = {
    getAllCredenciais,
    createCredencial,
    getCredencialById,
    updateCredencial,
    deleteCredencial,
    getCredencialByPessoaId
};

