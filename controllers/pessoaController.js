import prisma from '../db/db.js'; // Configuração do Prisma

// Função para criar uma pessoa
export const createPessoa = async (req, res) => {
  const {
    nome, sobrenome, nome_credencial, cpf, passaporte, email, telefone,
    data_nascimento, assinatura, foto, tamanho, endereco, observacao, empresa_id
  } = req.body;

  try {
    // Criar uma nova pessoa no banco de dados
    const newPessoa = await prisma.pessoas.create({
      data: {
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
        deleted_at: null,
      },
    });

    // Criar relação de empresa com a pessoa
    if (empresa_id) {
      await prisma.empresa_pessoa.create({
        data: {
          empresa_id,
          pessoa_id: newPessoa.id,
        },
      });
    }

    res.status(201).json({ message: 'Pessoa criada com sucesso', pessoa_id: newPessoa.id });
  } catch (error) {
    console.error("Erro ao criar pessoa:", error);
    res.status(500).json({ error: 'Erro ao criar a pessoa' });
  }
};

// Função para listar todas as pessoas
export const getAllPessoas = async (req, res) => {
  try {
    const pessoas = await prisma.pessoas.findMany({
      where: { deleted_at: null },
    });
    res.json(pessoas);
  } catch (error) {
    console.error("Erro ao buscar pessoas:", error);
    res.status(500).json({ error: 'Erro ao buscar pessoas' });
  }
};

// Função para listar pessoas por empresa
export const getPessoasByEmpresaId = async (req, res) => {
  const { empresaId } = req.params;

  try {
    const pessoas = await prisma.pessoas.findMany({
      where: {
        empresa_pessoa: {
          some: {
            empresa_id: parseInt(empresaId),
          },
        },
        deleted_at: null,
      },
    });
    res.json(pessoas);
  } catch (error) {
    console.error("Erro ao buscar pessoas da empresa:", error);
    res.status(500).json({ error: 'Erro ao buscar pessoas da empresa' });
  }
};

// Função para obter uma pessoa específica
export const getPessoaById = async (req, res) => {
  const { id } = req.params;

  try {
    const pessoa = await prisma.pessoas.findUnique({
      where: { id: parseInt(id) },
      include: {
        empresa_pessoa: true, // Inclui a relação com empresa
      },
    });

    if (!pessoa) {
      return res.status(404).json({ message: 'Pessoa não encontrada' });
    }

    res.json(pessoa);
  } catch (error) {
    console.error("Erro ao buscar pessoa:", error);
    res.status(500).json({ error: 'Erro ao buscar pessoa' });
  }
};

// Função para atualizar uma pessoa
export const updatePessoa = async (req, res) => {
  const { id } = req.params;
  const {
    nome, sobrenome, nome_credencial, cpf, passaporte, email, telefone,
    data_nascimento, assinatura, foto, tamanho, endereco, observacao
  } = req.body;

  try {
    const updatedPessoa = await prisma.pessoas.update({
      where: { id: parseInt(id) },
      data: {
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
        updated_at: new Date(),
      },
    });

    res.json({ message: 'Pessoa atualizada com sucesso', updatedPessoa });
  } catch (error) {
    console.error("Erro ao atualizar pessoa:", error);
    res.status(500).json({ error: 'Erro ao atualizar a pessoa' });
  }
};

// Função para excluir uma pessoa (soft delete)
export const deletePessoa = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPessoa = await prisma.pessoas.update({
      where: { id: parseInt(id) },
      data: { deleted_at: new Date() },
    });

    if (!deletedPessoa) {
      return res.status(404).json({ message: 'Pessoa não encontrada' });
    }

    res.json({ message: 'Pessoa excluída com sucesso' });
  } catch (error) {
    console.error("Erro ao excluir pessoa:", error);
    res.status(500).json({ error: 'Erro ao excluir a pessoa' });
  }
};

// Função para verificar se o documento existe (CPF ou passaporte)
export const verificar = async (req, res) => {
  const { documento, tipo } = req.params;

  try {
    let query;
    if (tipo === 'cpf') {
      query = prisma.pessoas.findFirst({ where: { cpf: documento, deleted_at: null } });
    } else if (tipo === 'passaporte') {
      query = prisma.pessoas.findFirst({ where: { passaporte: documento, deleted_at: null } });
    } else {
      return res.status(400).json({ error: 'Tipo de documento inválido' });
    }

    const pessoa = await query;

    res.json({ exists: !!pessoa });
  } catch (error) {
    console.error("Erro ao verificar documento:", error);
    res.status(500).json({ error: 'Erro ao verificar documento' });
  }
};
