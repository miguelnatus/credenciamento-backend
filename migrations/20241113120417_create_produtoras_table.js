/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const hasColumn = await knex.schema.hasColumn('produtoras', 'deleted_at');
  if (!hasColumn) {
    return knex.schema.table('produtoras', function(table) {
      table.timestamp('deleted_at').nullable();
    });
  }
};

exports.down = function(knex) {
  return knex.schema.table('produtoras', function(table) {
    table.dropColumn('deleted_at');
  });
};