/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('credencial_codigo', function(table) {
    table.increments('id').primary();
    table.string('codigo').notNullable();
    table.timestamp('data_cancelamento').nullable();
    table.text('motivo_cancelamento').nullable();
    table.integer('credencial_id').unsigned().references('id').inTable('credenciais');
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('credencial_codigo');
};
