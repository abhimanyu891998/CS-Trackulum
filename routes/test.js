var mysql = require('mysql');

//Creating connection with SQL database
var connection = mysql.createConnection({
    host    : 'sql12.freesqldatabase.com',
    user    : 'sql12280273',
    password    : 'sSiHHrnh6D',
    database : 'sql12280273'
});

connection.connect();

connection.query('SELECT * FROM Universities', function (err, rows, fields) {
    if (err) throw err
    console.log(rows);
    console.log('The solution is: ', rows[0].solution)
  })

  connection.end();