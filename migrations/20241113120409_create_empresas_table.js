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
          table.string('cnpj').notNullable();
          table.string('endereco');
          table.string('telefone');
          table.string('email');
          table.timestamps(true, true);
          table.timestamp('deleted_at').nullable();
        });
      }
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('empresas');
  };