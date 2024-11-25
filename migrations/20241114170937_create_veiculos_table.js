/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('veiculos', function(table) {
    table.increments('id').primary();
    table.string('placa', 7).notNullable().unique();
    table.string('modelo', 100).notNullable();
    table.string('cor', 50).notNullable();
    table.integer('ano').notNullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('veiculos');
};
