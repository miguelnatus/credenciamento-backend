/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const exists = await knex.schema.hasTable('eventos');
  if (!exists) {
    await knex.schema.createTable('eventos', function(table) {
      table.increments('id').primary();
      table.string('nome');
      table.string('descricao').nullable();
      table.string('local').nullable();
      table.date('data_evento').nullable();
      table.datetime('inicio_credenciamento').nullable();
      table.datetime('fim_credenciamento').nullable();
      table.integer('grupo_id').unsigned().nullable();
      table.foreign('grupo_id').references('id').inTable('evento_grupo');
      table.timestamps(true, true);
      table.timestamp('deleted_at').nullable();
    });
  }
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('eventos');
};