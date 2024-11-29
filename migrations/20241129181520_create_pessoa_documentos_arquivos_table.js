const { application } = require("express");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.hasTable('pessoa_documentos_arquivos').then(function (exists) {
        if (!exists) {
            return knex.schema.createTable('pessoa_documentos_arquivos', function (table) {
                table.increments('id').primary();
                table.boolean('nao_se_aplica').defaultTo(false);
                table.string('arquivo').nullable(); // nome do arquivo no wasabi
                table.string('url').nullable(); // url do arquivo no wasabi
                table.string('status').nullable(); // pendente, aprovado, reprovado
                table.text('observacao').nullable(); // observação sobre o status
                table.date('validade').nullable(); // data de validade do documento
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
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('empresa_documentos_arquivos');
};
