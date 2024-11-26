/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('pessoas', function(table) {
    table.increments('id').primary();
    table.string('nome', 100).notNullable();
    table.string('sobrenome', 100).nullable();
    table.string('nome_credencial', 100).nullable();
    table.string('cpf', 14).nullable().unique();
    table.string('passaporte', 20).nullable().unique();
    table.string('email').nullable();
    table.string('telefone', 20).nullable();
    table.date('data_nascimento').nullable();
    table.text('assinatura').nullable();
    table.text('foto').nullable();
    table.string('tamanho', 10).nullable();
    table.text('endereco').nullable();
    table.text('observacao').nullable();
    table.timestamps(true, true);
    table.date('deleted_at').nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('pessoas');
};
