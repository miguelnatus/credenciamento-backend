/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('eventos', function(table) {
      table.increments('id').primary();
      table.string('nome').notNullable();
      table.string('descricao');
      table.string('local');
      table.date('data_evento');
      table.datetime('inicio_credenciamento');
      table.datetime('fim_credenciamento');
      table.string('grupo');
      table.timestamps(true, true);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('eventos');
  };