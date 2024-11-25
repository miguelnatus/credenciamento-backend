/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('credencial_zona', function(table) {
    table.increments('id').primary();
    table.integer('credencial_id').unsigned().notNullable();
    table.integer('zona_id').unsigned().notNullable();
    table.timestamps(true, true);
    table.timestamp('deleted_at').nullable();

    table.foreign('credencial_id').references('credenciais.id');
    table.foreign('zona_id').references('zonas.id');

    table.unique(['credencial_id', 'zona_id']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('credencial_zona');
};
