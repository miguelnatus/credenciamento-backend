/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.hasTable('pessoa_documentos').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('pessoa_documentos', function(table) {
        table.increments('id').primary();
        table.string('arquivo').notNullable();
        table.integer('tamanho').notNullable(); // em bytes
        table.string('tipo_arquivo').notNullable(); // ex: pdf, jpg, png
        table.timestamps(true, true);
        table.timestamp('deleted_at').nullable();
      });
    }
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('pessoa_documentos');
};
