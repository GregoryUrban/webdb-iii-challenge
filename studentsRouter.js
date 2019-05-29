// Manage students (id, name)
const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const knexConfig = {
  client: 'sqlite3',
  connection: {
    filename: './data/lambda.db3',
  },
  useNullAsDefault: true, // needed for sqlite
  debug: true
};
const db = knex(knexConfig);

const server = express();

server.use(helmet());
server.use(express.json());

// list all students
server.get('/api/students', async (req, res) => {
  // get the students from the database
  try {
    const students = await db('students'); // all the records from the table
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json(error);
  }
});

// list a student by id
server.get('/api/students/:id', async (req, res) => {
  // get the students from the database
  try {
    const student = await db('students')
      .where({ id: req.params.id })
      .first();
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json(error);
  }
});

const errors = {
  '19': 'Another record with that value exists',
};

// create students
server.post('/api/students', async (req, res) => {
  try {
    const [id] = await db('students').insert(req.body);

    const student = await db('students')
      .where({ id })
      .first();

    res.status(201).json(student);
  } catch (error) {
    const message = errors[error.errno] || 'We ran into an error';
    res.status(500).json({ message, error });
  }
});
// update students
server.put('/api/students/:id', async (req, res) => {
  try {
    const count = await db('students')
      .where({ id: req.params.id })
      .update(req.body);

    if (count > 0) {
      const student = await db('students')
        .where({ id: req.params.id })
        .first();

      res.status(200).json(student);
    } else {
      res.status(404).json({ message: 'Records not found' });
    }
  } catch (error) {}
});

// remove students (inactivate the student)
server.delete('/api/students/:id', async (req, res) => {
  try {
    const count = await db('students')
      .where({ id: req.params.id })
      .del();

    if (count > 0) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Records not found' });
    }
  } catch (error) {}
});

const port = process.env.PORT || 5000;
server.listen(port, () =>
  console.log(`\n** API running on http://localhost:${port} **\n`)
);
