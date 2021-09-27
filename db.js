var mysql = require("mysql");

var devDatabase = {
  connectionLimit: 20,
  host: "localhost",
  user: "root",
  password: "password",
  database: "mcs_onboard_dev"
};

var prodDatabase = {

};

var dbConnection = mysql.createPool(devDatabase);

module.exports = dbConnection;