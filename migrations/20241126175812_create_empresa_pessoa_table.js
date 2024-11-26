/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('empresa_pessoa', function(table) {
    table.increments('id').primary();
    table.integer('empresa_id').unsigned().notNullable();
    table.integer('pessoa_id').unsigned().notNullable();
    table.foreign('empresa_id').references('id').inTable('empresas');
    table.foreign('pessoa_id').references('id').inTable('pessoas');
    table.timestamps(true, true);
    table.timestamp('deleted_at').nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('empresa_pessoa');
};
