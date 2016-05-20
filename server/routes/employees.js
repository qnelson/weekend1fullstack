var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/weekend1fullstack';

router.get('/', function (req, res) {
  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('SELECT * FROM employees', function (err, result) {
      done();

      res.send(result.rows);
    });
  });
});

router.post('/', function (req, res) {
  var employee = req.body;

  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('INSERT INTO employees (first_name, last_name, employee_id, job_title, salary) ' +
                  'VALUES ($1, $2, $3, $4, $5)',
                   [employee.first_name, employee.last_name, employee.employee_id, employee.job_title, employee.salary],
                 function (err, result) {
                   done();

                   if (err) {
                     res.sendStatus(500);
                     return;
                   }

                   res.sendStatus(201);
                 });
  });
});

router.delete('/:id', function (req, res) {
  var id = req.params.id;
  console.log(id);
  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }

    client.query('DELETE FROM employees ' +
                  'WHERE id = $1',
                   [id],
                 function (err, result) {
                   done();

                   if (err) {
                     console.log(err);
                     res.sendStatus(500);
                     return;
                   }

                   res.sendStatus(200);
                 });
  });
});

module.exports = router;
