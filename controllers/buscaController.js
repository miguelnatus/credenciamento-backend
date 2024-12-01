import prisma from '../db/db.js'; // Configuração do Prisma

// Função de busca
export const search = async (req, res) => {
  const { busca } = req.params;
  const { evento_id } = req.params;

  try {
    const empresas = await prisma.empresa.findMany({
      where: {
        deleted_at: null, // Empresas que não estão deletadas
        pessoas: {
          some: {
            OR: [
              { nome: { contains: busca, mode: 'insensitive' } },
              { sobrenome: { contains: busca, mode: 'insensitive' } },
              { cpf: { contains: busca, mode: 'insensitive' } },
              { observacao: { contains: busca, mode: 'insensitive' } },
              { passaporte: { contains: busca, mode: 'insensitive' } },
            ],
          },
        },
      },
      select: {
        id: true,
        nome: true,
        pessoas: {
          where: {
            deleted_at: null, // Pessoas que não estão deletadas
          },
          select: {
            id: true,
            nome: true,
            cpf: true,
            passaporte: true,
            credenciais: {
              where: {
                evento_id: parseInt(evento_id),
                deleted_at: null,
              },
              select: {
                id: true,
              },
            },
          },
        },
      },
      orderBy: {
        pessoas: {
          nome: 'asc',
        },
      },
    });

    // Formatar o resultado para manter o mesmo formato de resposta
    const resultado = empresas.flatMap((empresa) =>
      empresa.pessoas.map((pessoa) => ({
        empresa_id: empresa.id,
        empresa: empresa.nome,
        pessoa_id: pessoa.id,
        nome: pessoa.nome,
        documento: pessoa.cpf || pessoa.passaporte,
        credencial_id: pessoa.credenciais?.[0]?.id || null,
      }))
    );

    res.json(resultado);
  } catch (error) {
    console.error('Erro na busca:', error);
    res.status(500).json({ error: 'Erro ao realizar busca' });
  }
};
