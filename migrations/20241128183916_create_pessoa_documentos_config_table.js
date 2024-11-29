/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.hasTable('pessoa_documentos_config').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('pessoa_documentos_config', function(table) {
        table.increments('id').primary();
        table.boolean('obrigatorio').defaultTo(false);
        table.boolean('multiplos_arquivos').defaultTo(false);
        table.string('formato_permitido'); // ex: pdf,jpg,png
        table.integer('tamanho_maximo'); // em bytes
        table.integer('pessoa_tipo_id').unsigned();
        table.foreign('pessoa_tipo_id').references('pessoa_tipos.id');
        table.integer('pessoa_id').unsigned();
        table.foreign('pessoa_id').references('pessoas.id');
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
  return knex.schema.dropTableIfExists('pessoa_documentos_config');
};
