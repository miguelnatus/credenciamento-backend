import prisma from '../db/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Função para obter todas as credenciais
export const getAllCredenciais = async (req, res) => {
  try {
    const credenciais = await prisma.credenciais.findMany({
      where: { deleted_at: null }, // Exclui credenciais deletadas
    });
    res.json(credenciais);
  } catch (error) {
    console.error('Erro ao buscar credenciais:', error);
    res.status(500).json({ error: 'Erro ao buscar credenciais' });
  }
};

// Função para criar ou atualizar uma credencial
export const createOrUpdateCredencial = async (req, res) => {
  const { pessoa_id, veiculo_id, evento_id, empresa_id, setor_id, status_id, zonas } = req.body;

  try {
    // Verifica se já existe uma credencial para essa pessoa/evento
    const credencialExistente = await prisma.credenciais.findFirst({
      where: { pessoa_id, evento_id, deleted_at: null },
    });

    if (credencialExistente) {
      // Atualiza a credencial existente
      await prisma.credenciais.update({
        where: { id: credencialExistente.id },
        data: {
          veiculo_id,
          empresa_id,
          setor_id,
          status_id,
          updated_at: new Date(),
        },
      });

      // Atualiza as zonas
      if (zonas) {
        // Remove zonas antigas
        await prisma.credencial_zona.deleteMany({
          where: { credencial_id: credencialExistente.id },
        });

        // Adiciona novas zonas
        if (zonas.length > 0) {
          const zonasParaInserir = zonas.map((zona_id) => ({
            credencial_id: credencialExistente.id,
            zona_id,
          }));
          await prisma.credencial_zona.createMany({ data: zonasParaInserir });
        }
      }

      return res.json({ message: 'Credencial atualizada com sucesso' });
    } else {
      // Cria uma nova credencial
      const novaCredencial = await prisma.credenciais.create({
        data: {
          pessoa_id,
          veiculo_id,
          evento_id,
          empresa_id,
          setor_id,
          status_id,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      // Adiciona zonas
      if (zonas && zonas.length > 0) {
        const zonasParaInserir = zonas.map((zona_id) => ({
          credencial_id: novaCredencial.id,
          zona_id,
        }));
        await prisma.credencial_zona.createMany({ data: zonasParaInserir });
      }

      return res.status(201).json({ message: 'Credencial criada com sucesso', id: novaCredencial.id });
    }
  } catch (error) {
    console.error('Erro ao criar/atualizar credencial:', error);
    res.status(500).json({ error: 'Erro ao criar/atualizar credencial' });
  }
};

// Função para obter uma credencial pelo ID
export const getCredencialById = async (req, res) => {
  const { id } = req.params;

  try {
    const credencial = await prisma.credenciais.findUnique({
      where: { id: parseInt(id) },
      include: {
        credencial_zona: true, // Inclui zonas relacionadas
      },
    });

    if (credencial) {
      res.json(credencial);
    } else {
      res.status(404).json({ error: 'Credencial não encontrada' });
    }
  } catch (error) {
    console.error('Erro ao buscar credencial:', error);
    res.status(500).json({ error: 'Erro ao buscar credencial' });
  }
};

// Função para deletar (soft delete) uma credencial
export const deleteCredencial = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await prisma.credenciais.update({
      where: { id: parseInt(id) },
      data: { deleted_at: new Date() },
    });

    res.json({ message: 'Credencial deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar credencial:', error);
    res.status(500).json({ error: 'Erro ao deletar credencial' });
  }
};
