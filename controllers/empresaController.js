const bcrypt = require('bcrypt');
const db = require('../db/db');

async function createCompany(req, res) {
    
    try{
        const [newCompanyId] = await db('empresas').insert({ 
            id,
            nome,
            tipo,
            imagem,
            cnpj,
            responsavel,
            email,
            telefone,
            max_pessoas,
            max_veiculos,
            created_at,
            updated_at,
            deleted_at
        });

        res.status(201).json({ message: 'Empresa criada com sucesso', company_id: newCompanyId });
    }
    catch(error){
        console.error("Erro ao criar empresa:", error);
        res.status(500).json({ error: 'Erro ao criar a empresa' });
    }
}

async function getAllCompanies(req, res) {
    const { id, nome, tipo, cnpj, responsavel, email, telefone, max_pessoas, max_veiculos } = req.query; // Suporta filtros opcionais

    try {
        const query = db('empresas').whereNull('deleted_at');

        if (id) {
            query.andWhere({ id });
        }

        if (nome) {
            query.andWhere({ nome });
        }

        if (tipo) {
            query.andWhere({ tipo });
        }

        if (cnpj) {
            query.andWhere({ cnpj });
        }

        if (responsavel) {
            query.andWhere({ responsavel });
        }

        if (email) {
            query.andWhere({ email });
        }

        if (telefone) {
            query.andWhere({ telefone });
        }

        if (max_pessoas) {
            query.andWhere({ max_pessoas });
        }

        if (max_veiculos) {
            query.andWhere({ max_veiculos });
        }

        const companies = await query;
        res.json(companies);
    } catch (error) {
        console.error("Erro ao buscar empresas:", error);
        res.status(500).json({ error: 'Erro ao buscar empresas' });
    }
}

async function getCompanyById(req, res) {
    const { id } = req.params;

    try {
        const company = await db('empresas').where({ id }).whereNull('deleted_at').first();

        if (!company) {
            return res.status(404).json({ message: 'Empresa não encontrada' });
        }

        res.json(company);
    } catch (error) {
        console.error("Erro ao buscar empresa:", error);
        res.status(500).json({ error: 'Erro ao buscar empresa' });
    }
}

async function updateCompany(req, res) {
    const { id } = req.params;
    const { nome, tipo, imagem, cnpj, responsavel, email, telefone, max_pessoas, max_veiculos } = req.body;

    try {
        const updated = await db('empresas')
            .where({ id })
            .update({
                nome,
                tipo,
                imagem,
                cnpj,
                responsavel,
                email,
                telefone,
                max_pessoas,
                max_veiculos,
                updated_at: new Date()
            });

        if (!updated) {
            return res.status(404).json({ message: 'Empresa não encontrada' });
        }

        res.json({ message: 'Empresa atualizada com sucesso' });
    } catch (error) {
        console.error("Erro ao atualizar empresa:", error);
        res.status(500).json({ error: 'Erro ao atualizar empresa' });
    }
}

async function deleteCompany(req, res) {
    const { id } = req.params;

    try {
        const deleted = await db('empresas')
            .where({ id })
            .update({
                deleted_at: new Date()
            });

        if (!deleted) {
            return res.status(404).json({ message: 'Empresa não encontrada' });
        }

        res.json({ message: 'Empresa deletada com sucesso' });
    } catch (error) {
        console.error("Erro ao deletar empresa:", error);
        res.status(500).json({ error: 'Erro ao deletar empresa' });
    }
}

module.exports = {
    createCompany,
    getAllCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany
};