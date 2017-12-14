const mysql = require('mysql2'); // mysql

module.exports = {
   connect: function () {
      return mysql.createConnection({
         host: 'localhost',
         user: 'root',
         password: '',
         database: 'hifi'
      })
   }
}
// Opretter forbindelse til databasen