const restify = require('restify');
const path = require('path');
const fs = require('fs');
const mysql = require(path.join(__dirname, '..', 'config', 'mysql'));
const db = require('../config/mysql').connect();
const passwordHash = require('password-hash');
const crypto = require('crypto');

module.exports = (app) => {

   app.get('/products', (req, res, next) => {
      let db = mysql.connect();
      db.execute(`SELECT * FROM products`, [], (err, rows) => {
         if (err) {
            console.log(err);
         } else {
            res.json(200, rows);
         }
      })
      db.end();
   });
   // når man går ind på /products vælger den alt from products i databasen.

   app.get('/random', (req, res, next) => {
    let db = mysql.connect();
    db.execute(`SELECT * FROM products ORDER BY RAND() LIMIT 4`, [], (err, rows) => {
       if (err) {
          console.log(err);
       } else {
          res.json(200, rows);
       }
    })
    db.end();
 });

   app.get('/products/:id', (req, res, next) => {
      let id = (isNaN(req.params.id) ? 0 : req.params.id);
      if (id > 0) {
         let db = mysql.connect();
         db.execute(`SELECT * FROM products WHERE product_id = ?`, [req.params.id], (err, rows) => {
            if (err) {
               console.log(err);
            } else {
               res.json(200, rows);
            }
         })
         db.end();
      } else {
         res.json(400, {
            message: 'id ikke valid'
         });
      }
   });

   app.post('/products', (req, res, next) => {

      let name = (req.body.name == undefined ? '' : req.body.name);
      let description = (req.body.description == undefined ? '' : req.body.description);
      let price = (req.body.price == undefined ? 0 : req.body.price);
      let kategori = (req.body.kategori == undefined ? 0 : req.body.kategori);
      let producent = (req.body.producent == undefined ? 0 : req.body.producent);
      price = price.replace(',', '.');

      if (name != '' && description != '' && !isNaN(price)) {

         let db = mysql.connect();
         db.execute(`INSERT INTO products SET product_name = ?, product_description = ?, product_price = ?, product_kategori = ?, product_producent = ?`, [name, description, price, kategori, producent], (err, rows) => {
            if (err) {
               console.log(err);
            } else {
               res.json(200, rows);
            }
         })
         db.end();
      } else {
         res.json(400, {
            message: 'validering fejlede'
         });
      }
   });

   app.put('/products/:id', (req, res, next) => {

      let name = (req.body.name == undefined ? '' : req.body.name);
      let description = (req.body.description == undefined ? '' : req.body.description);
      let price = (req.body.price == undefined ? 0 : req.body.price);
      let kategori = (req.body.kategori == undefined ? 0 : req.body.kategori);
      let producent = (req.body.producent == undefined ? 0 : req.body.producent);
      let id = (isNaN(req.params.id) ? 0 : req.params.id);
      price = price.replace(',', '.');

      if (name != '' && description != '' && !isNaN(price) && id > 0) {

         let db = mysql.connect();
         db.execute(`UPDATE products SET product_name = ?, product_description = ?, product_price = ?, product_kategori = ?, product_producent = ? WHERE product_id = ?`, [name, description, price, kategori, producent, id], (err, rows) => {
            if (err) {
               console.log(err);
            } else {
               res.json(200, rows);
            }
         })
         db.end();
      } else {
         res.json(400, {
            message: 'validering fejlede'
         });
      }
   });

   app.del('/products/:id', (req, res, next) => {
      let id = (isNaN(req.params.id) ? 0 : req.params.id);
      if (id > 0) {
         let db = mysql.connect();
         db.execute(`DELETE FROM products WHERE product_id = ?`, [req.params.id], (err, rows) => {
            if (err) {
               console.log(err);
            } else {
               res.json(204);
            }
         })
         db.end();
      } else {
         res.json(400, {
            message: 'id ikke valid'
         });
      }
   }); 

    app.post('/login', (req, res) => {
      if (req.body.password !== '' && req.body.username !== '') {
        console.log(passwordHash.generate(req.body.password));
        db.execute('SELECT id, password FROM users WHERE username = ?', [req.body.username], (selError, rows) => {
          if (passwordHash.verify(req.body.password, rows[0].password)) {
            crypto.randomBytes(256, (err, buf) => {
              if (err) return res.status(500).end();
              else {
                const token = buf.toString('hex');
                db.execute('INSERT INTO accesstokens SET userid = ?, token = ?', [rows[0].id, token], (insError) => {
                  if (insError) return res.status(500).end();
                  else return res.send({ "ID": rows[0].id, "AccessToken": token });
                });
              }
            });
          } else {
          res.send(401);
          }
        });
      } else {
        res.send(401);
      }
    });

}