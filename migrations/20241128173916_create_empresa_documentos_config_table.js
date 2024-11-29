/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.hasTable('empresa_documentos_config').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('empresa_documentos_config', function(table) {
        table.increments('id').primary();
        table.boolean('obrigatorio').defaultTo(false);
        table.boolean('multiplos_arquivos').defaultTo(false);
        table.string('formato_permitido'); // ex: pdf,jpg,png
        table.integer('tamanho_maximo'); // em bytes
        table.integer('empresa_tipo_id').unsigned().nullable();
        table.foreign('empresa_tipo_id').references('empresa_tipos.id');
        table.integer('empresa_id').unsigned().nullable(); 
        table.foreign('empresa_id').references('empresas.id');
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
  return knex.schema.dropTableIfExists('empresa_documentos_config');
};
