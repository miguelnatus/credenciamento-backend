/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('produtoras', function(table) {
      table.increments('id').primary();
      table.string('nome').notNullable();
      table.string('descricao');
      table.timestamps(true, true);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('produtoras');
  };