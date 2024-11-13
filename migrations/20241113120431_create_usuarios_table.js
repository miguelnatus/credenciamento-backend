/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.hasTable('usuarios').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('usuarios', function(table) {
        table.increments('id').primary();
        table.string('nome').notNullable();
        table.string('email').notNullable().unique();
        table.string('senha').notNullable();
        table.timestamps(true, true);
      });
    }
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('usuarios');
};