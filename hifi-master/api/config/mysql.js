const mysql = require('mysql2'); // mysql

module.exports = {
   connect: function () {
      return mysql.createConnection({
         host: 'localhost',
         user: 'root',
         password: 'blf234fcm',
         database: 'hifi',
         port:3306
      })
   }
}
// Opretter forbindelse til databasen