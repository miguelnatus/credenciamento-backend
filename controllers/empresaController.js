import Joi from 'joi';
import prisma from '../db/db.js';

const companySchema = Joi.object({
    nome: Joi.string().required(),
    empresa_tipo_id: Joi.number().required(),
    cnpj: Joi.string().length(14).required(),
    responsavel: Joi.string().required(),
    email: Joi.string().email().required(),
    telefone: Joi.string().optional(),
});

export const createCompany = async (req, res) => {
    // Validação dos dados usando Joi
    const { error, value } = companySchema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const newCompany = await prisma.empresa.create({
        data: {
            ...value, // Usa os dados validados
            created_at: new Date(),
            updated_at: new Date(),
        },
        });

        res.status(201).json({ message: 'Empresa criada com sucesso', company_id: newCompany.id });
    } catch (error) {
        console.error("Erro ao criar empresa:", error);
        res.status(500).json({ message: 'Erro ao criar empresa', error: error.message });
    }
};

// Função para obter todas as empresas com filtros
export const getAllCompanies = async (req, res) => {
    const { id, nome, empresa_tipo_id, cnpj, responsavel, email, telefone } = req.query;

    try {
        const companies = await prisma.empresa.findMany({
            where: {
                deleted_at: null,
                AND: [
                    id ? { id: parseInt(id) } : {},
                    nome ? { nome: { contains: nome, mode: 'insensitive' } } : {},
                    empresa_tipo_id ? { empresa_tipo_id: parseInt(empresa_tipo_id) } : {},
                    cnpj ? { cnpj: { contains: cnpj } } : {},
                    responsavel ? { responsavel: { contains: responsavel, mode: 'insensitive' } } : {},
                    email ? { email: { contains: email, mode: 'insensitive' } } : {},
                    telefone ? { telefone: { contains: telefone } } : {}
                ],
            },
            include: {
                tipo: true, // Assumindo relação com tabela `empresa_tipos`
            },
        });

        res.json(companies);
    } catch (error) {
        console.error("Erro ao buscar empresas:", error);
        res.status(500).json({ error: 'Erro ao buscar empresas' });
    }
};

// Função para obter uma empresa pelo ID
export const getCompanyById = async (req, res) => {
    const { id } = req.params;

    try {
        const company = await prisma.empresa.findUnique({
            where: { id: parseInt(id) },
            include: {
                tipo: true, // Inclui o tipo da empresa
            },
        });

        if (!company) {
            return res.status(404).json({ message: 'Empresa não encontrada' });
        }

        res.json(company);
    } catch (error) {
        console.error("Erro ao buscar empresa:", error);
        res.status(500).json({ error: 'Erro ao buscar empresa' });
    }
};

// Função para atualizar uma empresa
export const updateCompany = async (req, res) => {
    const { id } = req.params;
    const { nome, empresa_tipo_id, cnpj, responsavel, email, telefone } = req.body;

    try {
        const updatedCompany = await prisma.empresa.update({
            where: { id: parseInt(id) },
            data: {
                nome,
                empresa_tipo_id,
                cnpj,
                responsavel,
                email,
                telefone,
                updated_at: new Date(),
            },
        });

        res.json({ message: 'Empresa atualizada com sucesso' });
    } catch (error) {
        console.error("Erro ao atualizar empresa:", error);
        res.status(500).json({ error: 'Erro ao atualizar empresa' });
    }
};

// Função para deletar uma empresa (soft delete)
export const deleteCompany = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedCompany = await prisma.empresa.update({
            where: { id: parseInt(id) },
            data: { deleted_at: new Date() },
        });

        res.json({ message: 'Empresa deletada com sucesso' });
    } catch (error) {
        console.error("Erro ao deletar empresa:", error);
        res.status(500).json({ error: 'Erro ao deletar empresa' });
    }
};
