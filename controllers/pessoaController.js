const db = require('../db/db');

async function createPessoa(req, res) {
    const { produtora_id, nome, sobrenome, nome_completo, nome_impressao, rg, cpf, passaporte, assinatura, funcao, imagem, imagem_base64, email, telefone, nascimento, tamanho, endereco, observacao, empresa_nome, documentos, documentos_tft, ingresso } = req.body;
    
    try {
        const [newPessoaId] = await db('pessoas').insert({
            produtora_id,
            nome,
            sobrenome,
            nome_completo,
            nome_impressao,
            rg,
            cpf,
            passaporte,
            assinatura,
            funcao,
            imagem,
            imagem_base64,
            email,
            telefone,
            nascimento,
            tamanho,
            endereco,
            observacao,
            empresa_nome,
            documentos,
            documentos_tft,
            ingresso,
            created_at: new Date(),
            updated_at: new Date()
        });
        
        res.status(201).json({ message: 'Pessoa criada com sucesso', pessoa_id: newPessoaId });
    } catch (error) {
        console.error("Erro ao criar pessoa:", error);
        res.status(500).json({ error: 'Erro ao criar a pessoa' });
    }
}

// Função para listar pessoas
async function getAllPessoas(req, res) {
    const { produtora_id } = req.query; // Suporta filtros opcionais

    try {
        const query = db('pessoas').whereNull('deleted_at');

        if (produtora_id) {
            query.andWhere({ produtora_id });
        }

        const pessoas = await query;
        res.json(pessoas);
    } catch (error) {
        console.error("Erro ao buscar pessoas:", error);
        res.status(500).json({ error: 'Erro ao buscar pessoas' });
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
    const { produtora_id, nome, sobrenome, nome_completo, nome_impressao, rg, cpf, passaporte, assinatura, funcao, imagem, imagem_base64, email, telefone, nascimento, tamanho, endereco, observacao, empresa_nome, documentos, documentos_tft, ingresso } = req.body;

    try {
        const updated = await db('pessoas')
            .where({ id })
            .update({
                produtora_id,
                nome,
                sobrenome,
                nome_completo,
                nome_impressao,
                rg,
                cpf,
                passaporte,
                assinatura,
                funcao,
                imagem,
                imagem_base64,
                email,
                telefone,
                nascimento,
                tamanho,
                endereco,
                observacao,
                empresa_nome,
                documentos,
                documentos_tft,
                ingresso,
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
        const deleted = await db('pessoas').where({ id }).update({ deleted_at: new Date() });

        if (!deleted) {
            return res.status(404).json({ message: 'Pessoa não encontrada para exclusão' });
        }

        res.json({ message: 'Pessoa excluída com sucesso' });
    } catch (error) {
        console.error("Erro ao excluir pessoa:", error);
        res.status(500).json({ error: 'Erro ao excluir a pessoa' });
    }
}

module.exports = {
    createPessoa,
    getAllPessoas,
    getPessoaById,
    updatePessoa,
    deletePessoa
};