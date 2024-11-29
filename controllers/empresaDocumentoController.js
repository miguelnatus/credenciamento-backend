
const db = require('../db/db');

async function createDocumentType(req, res) {
    const { arquivo, tamanho, tipo_arquivo } = req.body;
    
    try {
        const [newDocTypeId] = await db('empresa_documentos').insert({
            arquivo,
            tamanho,
            tipo_arquivo,
            created_at: new Date(),
            updated_at: new Date()
        });
        
        res.status(201).json({ message: 'Documento criado com sucesso', documento_id: newDocTypeId });
    } catch (error) {
        console.error("Erro ao criar documento:", error);
        res.status(500).json({ error: 'Erro ao criar documento' });
    }
}

async function getAllDocumentTypes(req, res) {
    try {
        const documents = await db('empresa_documentos')
            .whereNull('deleted_at')
            .select('id', 'arquivo', 'tamanho', 'tipo_arquivo');
        res.json(documents);
    } catch (error) {
        console.error("Erro ao buscar documentos:", error);
        res.status(500).json({ error: 'Erro ao buscar documentos' });
    }
}

async function getDocumentTypeById(req, res) {
    const { id } = req.params;

    try {
        const document = await db('empresa_documentos')
            .where({ id })
            .whereNull('deleted_at')
            .select('id', 'arquivo', 'tamanho', 'tipo_arquivo')
            .first();

        if (!document) {
            return res.status(404).json({ message: 'Documento não encontrado' });
        }

        res.json(document);
    } catch (error) {
        console.error("Erro ao buscar documento:", error);
        res.status(500).json({ error: 'Erro ao buscar documento' });
    }
}

async function updateDocumentType(req, res) {
    const { id } = req.params;
    const { arquivo, tamanho, tipo_arquivo } = req.body;

    try {
        const updated = await db('empresa_documentos')
            .where({ id })
            .update({
                arquivo,
                tamanho,
                tipo_arquivo,
                updated_at: new Date()
            });

        if (!updated) {
            return res.status(404).json({ message: 'Documento não encontrado' });
        }

        res.json({ message: 'Documento atualizado com sucesso' });
    } catch (error) {
        console.error("Erro ao atualizar documento:", error);
        res.status(500).json({ error: 'Erro ao atualizar documento' });
    }
}

async function deleteDocumentType(req, res) {
    const { id } = req.params;

    try {
        const deleted = await db('empresa_documentos')
            .where({ id })
            .update({ 
                deleted_at: new Date(),
                updated_at: new Date()
            });

        if (!deleted) {
            return res.status(404).json({ message: 'Documento não encontrado' });
        }

        res.json({ message: 'Documento excluído com sucesso' });
    } catch (error) {
        console.error("Erro ao excluir documento:", error);
        res.status(500).json({ error: 'Erro ao excluir documento' });
    }
}

module.exports = {
    createDocumentType,
    getAllDocumentTypes,
    getDocumentTypeById,
    updateDocumentType,
    deleteDocumentType
};
