exports.up = function (knex) {
// Código para aplicar as mudanças no banco de dados
    return knex.schema.createTable('setores', (table) => {
        table.increments('id').primary();
        table.string('nome').notNullable();
        table.decimal('valor', 10, 2).nullable();
        table.string('tipo').nullable();
        table.time('hora_entrada').nullable();
        table.time('hora_saida').nullable();
        table.timestamps(true, true);

    });
};

exports.down = function (knex) {
// Código para reverter as mudanças no banco de dados
return knex.schema.dropTableIfExists('setores');

};
  