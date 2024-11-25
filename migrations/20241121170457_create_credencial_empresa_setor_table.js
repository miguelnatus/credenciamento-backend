/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('credencial_empresa_setor', function(table) {
    table.increments('id').primary();
    table.integer('empresa_id').unsigned().notNullable();
    table.integer('setor_id').unsigned().notNullable();
    table.integer('evento_id').unsigned().notNullable();
    table.integer('limite_pessoas').notNullable();
    table.integer('limite_veiculos').notNullable();
    table.timestamps(true, true);
    table.timestamp('deleted_at').nullable();

    table.foreign('empresa_id').references('empresas.id');
    table.foreign('setor_id').references('setores.id');
    table.foreign('evento_id').references('eventos.id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('credencial_empresa_setor');
};
