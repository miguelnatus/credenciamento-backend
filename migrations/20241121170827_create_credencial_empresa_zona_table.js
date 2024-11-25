/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('credencial_empresa_zona', function(table) {
    table.increments('id').primary();
    table.integer('ces_id').unsigned().notNullable();
    table.integer('zona_id').unsigned().notNullable(); 
    table.integer('limite').notNullable();
    table.timestamps(true, true);
    table.timestamp('deleted_at').nullable();

    table.foreign('ces_id').references('credencial_empresa_setor.id');
    table.foreign('zona_id').references('zonas.id');

    table.unique(['ces_id', 'zona_id']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('credencial_empresa_zona');
};
