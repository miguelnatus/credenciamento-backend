/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('credenciais', function(table) {
    table.increments('id').primary();
    table.integer('pessoa_id').unsigned().nullable();
    table.integer('veiculo_id').unsigned().nullable();
    table.integer('evento_id').unsigned().notNullable();
    table.integer('empresa_id').unsigned().notNullable();
    table.integer('setor_id').unsigned().notNullable();
    table.integer('status_id').unsigned().nullable();
    table.timestamp('impresso').nullable();
    table.timestamp('retirado').nullable();
    table.timestamp('checkin').nullable();
    table.timestamp('checkout').nullable();
    table.timestamps(true, true);
    table.timestamp('deleted_at').nullable();

    table.foreign('pessoa_id').references('pessoas.id');
    table.foreign('veiculo_id').references('veiculos.id');
    table.foreign('evento_id').references('eventos.id');
    table.foreign('empresa_id').references('empresas.id');
    table.foreign('setor_id').references('setores.id');
    table.foreign('status_id').references('credencial_status.id');

    table.unique(['pessoa_id', 'evento_id', 'empresa_id', 'setor_id']);
    table.unique(['veiculo_id', 'evento_id', 'empresa_id', 'setor_id']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('credenciais');
};
