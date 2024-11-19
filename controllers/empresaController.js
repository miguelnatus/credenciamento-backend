const bcrypt = require('bcrypt');
const db = require('../db/db');

async function createCompany(req, res) {
    const {
        nome,
        empresa_tipo_id,
        cnpj,
        responsavel,
        email,
        telefone
    } = req.body;

    const created_at = new Date();
    const updated_at = new Date();
    const deleted_at = null;

    try {
        const [newCompanyId] = await db('empresas').insert({ 
            nome,
            empresa_tipo_id,
            cnpj,
            responsavel,
            email,
            telefone,
            created_at,
            updated_at,
            deleted_at
        });

        res.status(201).json({ message: 'Empresa criada com sucesso', company_id: newCompanyId });
    } catch (error) {
        console.error("Erro ao criar empresa:", error);
        res.status(500).json({ message: 'Erro ao criar empresa', error: error.message });
    }
}

async function getAllCompanies(req, res) {
    const { id, nome, empresa_tipo_id, cnpj, responsavel, email, telefone } = req.query;

    try {
        const query = db('empresas')
            .select('empresas.*', 'empresa_tipos.nome as tipo_nome')
            .leftJoin('empresa_tipos', 'empresas.empresa_tipo_id', 'empresa_tipos.id')
            .whereNull('empresas.deleted_at');

        if (id) {
            query.andWhere('empresas.id', id);
        }

        if (nome) {
            query.andWhere('empresas.nome', nome);
        }

        if (empresa_tipo_id) {
            query.andWhere('empresas.empresa_tipo_id', empresa_tipo_id);
        }

        if (cnpj) {
            query.andWhere('empresas.cnpj', cnpj);
        }

        if (responsavel) {
            query.andWhere('empresas.responsavel', responsavel);
        }

        if (email) {
            query.andWhere('empresas.email', email);
        }

        if (telefone) {
            query.andWhere('empresas.telefone', telefone);
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
        const company = await db('empresas')
            .select('empresas.*', 'empresa_tipos.nome as tipo_nome')
            .leftJoin('empresa_tipos', 'empresas.empresa_tipo_id', 'empresa_tipos.id')
            .where('empresas.id', id)
            .whereNull('empresas.deleted_at')
            .first();

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
    const { nome, empresa_tipo_id, cnpj, responsavel, email, telefone } = req.body;

    try {
        const updated = await db('empresas')
            .where({ id })
            .update({
                nome,
                empresa_tipo_id,
                cnpj,
                responsavel,
                email,
                telefone,
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