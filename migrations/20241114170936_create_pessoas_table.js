/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('pessoas', function(table) {
    table.increments('id').primary();
    table.string('nome', 100).notNullable();
    table.string('sobrenome', 100).notNullable();
    table.string('nome_credencial', 100).notNullable();
    table.string('cpf', 14).notNullable().unique();
    table.string('passaporte', 20);
    table.string('email').notNullable();
    table.string('telefone', 20).notNullable();
    table.date('data_nascimento').notNullable();
    table.text('assinatura').nullable();
    table.text('foto').nullable();
    table.string('tamanho', 10).nullable();
    table.text('endereco').nullable();
    table.text('observacao').nullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('pessoas');
};
