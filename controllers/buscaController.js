const db = require('../db/db');

async function search(req, res) {
    const { busca } = req.params;
    const { evento_id } = req.params;

    try {
        const empresas = await db('empresas')
            .join('empresa_pessoa', 'empresas.id', '=', 'empresa_pessoa.empresa_id')
            .join('pessoas', 'pessoas.id', '=', 'empresa_pessoa.pessoa_id')
            .leftJoin('credenciais', function() {
                this.on('pessoas.id', '=', 'credenciais.pessoa_id')
                    .andOn('credenciais.evento_id', '=', db.raw('?', [evento_id]))
                    .andOnNull('credenciais.deleted_at');
            })
            .andWhere(function() {
                this.where('pessoas.nome', 'like', `%${busca}%`)
                    .orWhere('pessoas.sobrenome', 'like', `%${busca}%`) 
                    .orWhere('pessoas.cpf', 'like', `%${busca}%`)
                    .orWhere('pessoas.observacao', 'like', `%${busca}%`)
                    .orWhere('pessoas.passaporte', 'like', `%${busca}%`)
                    .orWhere('empresas.nome', 'like', `%${busca}%`);
            })
            .select(
                'empresas.id as empresa_id',
                'empresas.nome as empresa',
                'pessoas.id as pessoa_id',
                'pessoas.nome as nome',
                db.raw('COALESCE(pessoas.cpf, pessoas.passaporte) as documento'),
                'credenciais.id as credencial_id'
            )
            .orderBy('pessoas.nome')
            .whereNull('empresas.deleted_at')
            .whereNull('pessoas.deleted_at')
            .groupBy('pessoas.id');

        res.json(empresas);

    } catch (error) {
        console.error("Erro na busca:", error);
        res.status(500).json({ error: 'Erro ao realizar busca' });
    }
}

module.exports = {
    search
};
