/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('setores', function(table) {
    table.increments('id').primary();
    table.string('nome').notNullable();
    table.decimal('valor', 10, 2).nullable().defaultTo(null);
    table.string('tipo').nullable().defaultTo(null);
    table.time('hora_entrada').nullable().defaultTo(null);
    table.time('hora_saida').nullable().defaultTo(null); 
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('setores');
};
