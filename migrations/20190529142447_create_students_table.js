
exports.up = function(knex, Promise) {
  return knex.schema.createTable('students', tbl => {
      tbl.increments()
      tbl.string('name')

      // foreign key to enable joins to cohorts
      tbl
    //   .increments('cohort_id')
      .integer('cohort_id')
      .unsigned()
      .references('id')
      .inTable('cohorts')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
      ;

      tbl.timestamps(true,true);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('students')
};
