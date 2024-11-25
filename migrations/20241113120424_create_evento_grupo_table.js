/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const exists = await knex.schema.hasTable('evento_grupo');
  if (!exists) {
    await knex.schema.createTable('evento_grupo', function(table) {
      table.increments('id').primary();
      table.string('nome');
      table.timestamps(true, true);
      table.timestamp('deleted_at').nullable();
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('evento_grupo');
};
