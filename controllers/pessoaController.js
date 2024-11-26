const db = require('../db/db');

async function createPessoa(req, res) {
    console.log(req.body);

    const { nome, sobrenome, nome_credencial, cpf, passaporte, email, telefone, data_nascimento, assinatura, foto, tamanho, endereco, observacao } = req.body;
    
    try {
        const [newPessoaId] = await db('pessoas').insert({
            nome,
            sobrenome,
            nome_credencial,
            cpf,
            passaporte,
            email,
            telefone,
            data_nascimento,
            assinatura,
            foto,
            tamanho,
            endereco,
            observacao,
            created_at: new Date(),
            updated_at: new Date(),
            deleted_at: null
        });

        await db('empresa_pessoa').insert({
            empresa_id: req.body.empresa_id,
            pessoa_id: newPessoaId
        });
        
        res.status(201).json({ message: 'Pessoa criada com sucesso', pessoa_id: newPessoaId });
    } catch (error) {
        console.error("Erro ao criar pessoa:", error);
        res.status(500).json({ error: 'Erro ao criar a pessoa' });
    }
}

// Função para listar pessoas
async function getAllPessoas(req, res) {
    try {
        const query = db('pessoas').whereNull('deleted_at');
        const pessoas = await query;
        res.json(pessoas);
    } catch (error) {
        console.error("Erro ao buscar pessoas:", error);
        res.status(500).json({ error: 'Erro ao buscar pessoas' });
    }
}

// Função para listar pessoas por empresa
async function getPessoasByEmpresaId(req, res) {
    const { empresaId } = req.params;
    
    try {
        const pessoas = await db('pessoas')
            .join('empresa_pessoa', 'pessoas.id', '=', 'empresa_pessoa.pessoa_id')
            .where('empresa_pessoa.empresa_id', empresaId)
            .whereNull('pessoas.deleted_at')
            .select('pessoas.*');

        res.json(pessoas);
    } catch (error) {
        console.error("Erro ao buscar pessoas da empresa:", error);
        res.status(500).json({ error: 'Erro ao buscar pessoas da empresa' });
    }
}


// Função para obter uma pessoa específica
async function getPessoaById(req, res) {
    const { id } = req.params;

    try {
        const pessoa = await db('pessoas').where({ id }).whereNull('deleted_at').first();

        if (!pessoa) {
            return res.status(404).json({ message: 'Pessoa não encontrada' });
        }

        res.json(pessoa);
    } catch (error) {
        console.error("Erro ao buscar pessoa:", error);
        res.status(500).json({ error: 'Erro ao buscar pessoa' });
    }
}

// Função para atualizar uma pessoa
async function updatePessoa(req, res) {
    const { id } = req.params;
    const { nome, sobrenome, nome_credencial, cpf, passaporte, email, telefone, data_nascimento, assinatura, foto, tamanho, endereco, observacao } = req.body;

    try {
        const updated = await db('pessoas')
            .where({ id })
            .whereNull('deleted_at')
            .update({
                nome,
                sobrenome,
                nome_credencial,
                cpf,
                passaporte,
                email,
                telefone,
                data_nascimento,
                assinatura,
                foto,
                tamanho,
                endereco,
                observacao,
                updated_at: new Date()
            });

        if (!updated) {
            return res.status(404).json({ message: 'Pessoa não encontrada para atualização' });
        }

        res.json({ message: 'Pessoa atualizada com sucesso' });
    } catch (error) {
        console.error("Erro ao atualizar pessoa:", error);
        res.status(500).json({ error: 'Erro ao atualizar a pessoa' });
    }
}

// Função para excluir uma pessoa
async function deletePessoa(req, res) {
    const { id } = req.params;

    try {
        const deleted = await db('pessoas')
            .where({ id })
            .whereNull('deleted_at')
            .update({ 
                deleted_at: new Date(),
                updated_at: new Date()
            });

        if (!deleted) {
            return res.status(404).json({ message: 'Pessoa não encontrada para exclusão' });
        }

        res.json({ message: 'Pessoa excluída com sucesso' });
    } catch (error) {
        console.error("Erro ao excluir pessoa:", error);
        res.status(500).json({ error: 'Erro ao excluir a pessoa' });
    }
}

async function verificar(req, res) {
    const { documento, tipo } = req.params;
    
    let query = db('pessoas').whereNull('deleted_at');
    
    if (tipo === 'cpf') {
        query = query.where({ cpf: documento });
    } else if (tipo === 'passaporte') {
        query = query.where({ passaporte: documento });
    }
    
    const pessoa = await query.first();
    res.json({ exists: !!pessoa });
}

module.exports = {
    createPessoa,
    getAllPessoas,
    getPessoaById,
    updatePessoa,
    deletePessoa,
    verificar,
    getPessoasByEmpresaId
};