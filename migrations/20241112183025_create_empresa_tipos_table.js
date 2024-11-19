/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.hasTable('empresa_tipos').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('empresa_tipos', function(table) {
        table.increments('id').primary();
        table.string('nome').notNullable();
        table.string('descricao');
        table.timestamps(true, true);
        table.timestamp('deleted_at').nullable();
      });
    }
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('empresa_tipos');
};
