const mysql = require("mysql");

const devDatabase = {
  connectionLimit: 40,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME_DEV,
  multipleStatements: true
};

const prodDatabase = {
  connectionLimit: 20,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME_PROD,
  multipleStatements: true
};

const dbConnection = mysql.createPool(prodDatabase);

module.exports = dbConnection;
