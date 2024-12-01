import prisma from '../db/db.js'; // Configuração do Prisma

// Função para criar um novo tipo de documento
export async function createDocumentType(req, res) {
    const { arquivo, tamanho, tipo_arquivo } = req.body;

    try {
        const newDocType = await prisma.empresa_documentos.create({
            data: {
                arquivo,
                tamanho,
                tipo_arquivo,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });

        res.status(201).json({ message: 'Documento criado com sucesso', documento_id: newDocType.id });
    } catch (error) {
        console.error("Erro ao criar documento:", error);
        res.status(500).json({ error: 'Erro ao criar documento' });
    }
}

// Função para obter todos os tipos de documentos
export async function getAllDocumentTypes(req, res) {
    try {
        const documents = await prisma.empresa_documentos.findMany({
            where: {
                deleted_at: null,
            },
            select: {
                id: true,
                arquivo: true,
                tamanho: true,
                tipo_arquivo: true,
            },
        });
        res.json(documents);
    } catch (error) {
        console.error("Erro ao buscar documentos:", error);
        res.status(500).json({ error: 'Erro ao buscar documentos' });
    }
}

// Função para obter um tipo de documento pelo ID
export async function getDocumentTypeById(req, res) {
    const { id } = req.params;

    try {
        const document = await prisma.empresa_documentos.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                arquivo: true,
                tamanho: true,
                tipo_arquivo: true,
            },
        });

        if (!document) {
            return res.status(404).json({ message: 'Documento não encontrado' });
        }

        res.json(document);
    } catch (error) {
        console.error("Erro ao buscar documento:", error);
        res.status(500).json({ error: 'Erro ao buscar documento' });
    }
}

// Função para atualizar um tipo de documento
export async function updateDocumentType(req, res) {
    const { id } = req.params;
    const { arquivo, tamanho, tipo_arquivo } = req.body;

    try {
        const updatedDocument = await prisma.empresa_documentos.update({
            where: { id: parseInt(id) },
            data: {
                arquivo,
                tamanho,
                tipo_arquivo,
                updated_at: new Date(),
            },
        });

        res.json({ message: 'Documento atualizado com sucesso' });
    } catch (error) {
        console.error("Erro ao atualizar documento:", error);
        res.status(500).json({ error: 'Erro ao atualizar documento' });
    }
}

// Função para excluir um tipo de documento (soft delete)
export async function deleteDocumentType(req, res) {
    const { id } = req.params;

    try {
        const deletedDocument = await prisma.empresa_documentos.update({
            where: { id: parseInt(id) },
            data: {
                deleted_at: new Date(),
                updated_at: new Date(),
            },
        });

        res.json({ message: 'Documento excluído com sucesso' });
    } catch (error) {
        console.error("Erro ao excluir documento:", error);
        res.status(500).json({ error: 'Erro ao excluir documento' });
    }
}
