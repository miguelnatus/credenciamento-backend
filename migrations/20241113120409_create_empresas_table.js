/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.hasTable('empresas').then(function(exists) {
      if (!exists) {
        return knex.schema.createTable('empresas', function(table) {
          table.increments('id').primary();
          table.string('nome').notNullable();
          table.integer('empresa_tipo_id').unsigned().references('id').inTable('empresa_tipos');
          table.string('cnpj').nullable();
          table.string('endereco').nullable();
          table.string('telefone').nullable();
          table.string('email').nullable();
          table.string('responsavel').nullable();
          table.timestamps(true, true);
          table.timestamp('deleted_at').nullable();
        });
      }
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('empresas');
  };