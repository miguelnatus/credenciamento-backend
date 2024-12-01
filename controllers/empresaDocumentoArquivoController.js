const db = require('../database/connection');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

// Configuração do cliente Wasabi (S3 compatível)
const s3Client = new S3Client({
    region: process.env.WASABI_REGION,
    endpoint: process.env.WASABI_ENDPOINT,
    credentials: {
        accessKeyId: process.env.WASABI_ACCESS_KEY_ID,
        secretAccessKey: process.env.WASABI_SECRET_ACCESS_KEY
    }
});

const BUCKET_NAME = process.env.WASABI_BUCKET_NAME;

async function criarArquivo(req, res) {
    try {
        const { 
            empresa_id,
            nao_se_aplica,
            validade,
            arquivo, // Buffer do arquivo
            nomeArquivo // Nome original do arquivo
        } = req.body;

        // Upload do arquivo para o Wasabi
        const key = `empresas/${empresa_id}/documentos/${Date.now()}-${nomeArquivo}`;
        
        const uploadParams = {
            Bucket: BUCKET_NAME,
            Key: key,
            Body: arquivo,
            ContentType: req.file.mimetype
        };

        await s3Client.send(new PutObjectCommand(uploadParams));

        // URL do arquivo no Wasabi
        const fileUrl = `https://${BUCKET_NAME}.s3.${process.env.WASABI_REGION}.wasabisys.com/${key}`;

        // Salvar informações no banco de dados
        const [id] = await db('empresa_documentos_arquivos').insert({
            empresa_id,
            nao_se_aplica,
            validade,
            arquivo: key,
            url: fileUrl,
            status: 'pendente',
            created_at: new Date(),
            updated_at: new Date()
        });

        res.status(201).json({
            id,
            message: 'Arquivo criado com sucesso',
            url: fileUrl
        });

    } catch (error) {
        console.error('Erro ao criar arquivo:', error);
        res.status(500).json({ error: 'Erro ao criar arquivo' });
    }
}

async function listarArquivos(req, res) {
    try {
        const arquivos = await db('empresa_documentos_arquivos')
            .whereNull('deleted_at')
            .select('*');
        
        res.json(arquivos);
    } catch (error) {
        console.error('Erro ao listar arquivos:', error);
        res.status(500).json({ error: 'Erro ao listar arquivos' });
    }
}

async function buscarArquivoPorId(req, res) {
    const { id } = req.params;
    
    try {
        const arquivo = await db('empresa_documentos_arquivos')
            .where({ id })
            .whereNull('deleted_at')
            .first();

        if (!arquivo) {
            return res.status(404).json({ message: 'Arquivo não encontrado' });
        }

        res.json(arquivo);
    } catch (error) {
        console.error('Erro ao buscar arquivo:', error);
        res.status(500).json({ error: 'Erro ao buscar arquivo' });
    }
}

async function atualizarArquivo(req, res) {
    const { id } = req.params;
    const { 
        nao_se_aplica,
        validade,
        status,
        observacao 
    } = req.body;

    try {
        const arquivo = await db('empresa_documentos_arquivos')
            .where({ id })
            .first();

        if (!arquivo) {
            return res.status(404).json({ message: 'Arquivo não encontrado' });
        }

        await db('empresa_documentos_arquivos')
            .where({ id })
            .update({
                nao_se_aplica,
                validade,
                status,
                observacao,
                updated_at: new Date()
            });

        res.json({ message: 'Arquivo atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar arquivo:', error);
        res.status(500).json({ error: 'Erro ao atualizar arquivo' });
    }
}

async function deletarArquivo(req, res) {
    const { id } = req.params;

    try {
        const arquivo = await db('empresa_documentos_arquivos')
            .where({ id })
            .first();

        if (!arquivo) {
            return res.status(404).json({ message: 'Arquivo não encontrado' });
        }

        // Deletar arquivo do Wasabi
        const deleteParams = {
            Bucket: BUCKET_NAME,
            Key: arquivo.arquivo
        };

        await s3Client.send(new DeleteObjectCommand(deleteParams));

        // Soft delete no banco de dados
        await db('empresa_documentos_arquivos')
            .where({ id })
            .update({ 
                deleted_at: new Date(),
                updated_at: new Date()
            });

        res.json({ message: 'Arquivo excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar arquivo:', error);
        res.status(500).json({ error: 'Erro ao deletar arquivo' });
    }
}

module.exports = {
    criarArquivo,
    listarArquivos,
    buscarArquivoPorId,
    atualizarArquivo,
    deletarArquivo
};
