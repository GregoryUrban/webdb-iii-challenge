// implement changes to the schema
exports.up = function(knex, Promise) {
    return knex.schema.createTable('cohorts', tbl => {
        tbl.increments('id').primary();
        tbl.string('name', 128).notNullable().unique();
        // tbl.timestamps(true, true); // create at and updated at - very useful
    })
};

// undo the changes
exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('cohorts');
};


// yarn knex init
// yarn knex migrate:make create_cohorts_table
// yarn knex migate:latest