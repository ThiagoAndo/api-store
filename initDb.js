const sql = require("better-sqlite3");
const db = sql("e-comerce.db");
const { products } = require("./data/productsData");
const { insertP } = require("./actions/productActions");
function initDB() {
  db.prepare(
    `CREATE TABLE IF NOT EXISTS products (
       id TEXT NOT NULL  PRIMARY KEY,
       title TEXT NOT NULL UNIQUE,
       description TEXT NOT NULL,
       price FLOAT NOT NULL,
       discountPercentage FLOAT NOT NULL,
       rating FLOAT NOT NULL,
       stock INT NOT NULL,
       brand TEXT NOT NULL,
       category TEXT NOT NULL,
       thumbnail TEXT NOT NULL
    )
`
  ).run();

  db.prepare(
    `
   CREATE TABLE IF NOT EXISTS images (
       item_id TEXT NOT NULL ,
       image TEXT NOT NULL,
       FOREIGN KEY (item_id)
       REFERENCES products (id) 
         )
`
  ).run();

  db.prepare(
    `
   CREATE TABLE IF NOT EXISTS users (
      email_address      TEXT NOT NULL UNIQUE,
      first_name         TEXT NOT NULL,
      last_name          TEXT NOT NULL,
      created_at         TIMESTAMP NOT NULL,
      id                 TEXT NOT NULL PRIMARY KEY,
      password           TEXT NOT NULL UNIQUE
      )
`
  ).run();

  db.prepare(
    `
   CREATE TABLE IF NOT EXISTS userAddress (
       id TEXT NOT NULL ,
       line_one TEXT NOT NULL,
       line_two TEXT,
       town_city  TEXT NOT NULL,
       constry_state TEXT NOT NULL,
       FOREIGN KEY (id)
       REFERENCES users (id) 
         )
`
  ).run();

  db.prepare(
    `
   CREATE TABLE IF NOT EXISTS cart (
      user_id  TEXT NOT NULL ,
      item_id  TEXT NOT NULL ,
      qnt      INTEGER NOT NULL,
      bought   INTEGER NOT NULL,
      price   INTEGER NOT NULL,
      name   TEXT NOT NULL,
      creation_at TIMESTAMP NOT NULL,
      FOREIGN KEY (user_id)
      REFERENCES users (id) 
         )
`
  ).run();
  db.prepare(
    `
   CREATE TABLE IF NOT EXISTS orders (
      invoice_id  INTEGER PRIMARY KEY AUTOINCREMENT,
      cart_id         INTEGER NOT NULL,
      user_id         TEXT NOT NULL,
      paid_at         TIMESTAMP NOT NULL,
      total           REAL NOT NULL,
      FOREIGN KEY (user_id)
      REFERENCES users (id)
      )
`
  ).run();

  insertP(products);
}

// initDB()
