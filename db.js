var mysql = require("mysql");

var devDatabase = {
  connectionLimit: 20,
  host: process.env.DB_HOST_DEV,
  user: process.env.DB_USER_DEV,
  password: process.env.DB_PASSWORD_DEV,
  database: process.env.DB_NAME_DEV,
  multipleStatements: true
};

var prodDatabase = {

};

var dbConnection = mysql.createPool(devDatabase);

module.exports = dbConnection;