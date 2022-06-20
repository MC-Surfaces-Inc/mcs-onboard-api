const mysql = require("mysql");

const devDatabase = {
  connectionLimit: 20,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME_DEV,
  port: 3306,
  multipleStatements: true
};

const prodDatabase = {
  connectionLimit: 20,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME_PROD,
  port: 3306,
  multipleStatements: true
};

const dbConnection = mysql.createPool(prodDatabase);

module.exports = dbConnection;
