var express = require("express");
var mysql = require("mysql");
var router = express.Router( );

var db = require("../../db");
const logger = require("../common/Logging/logger");

router.put("/", (req, res) => {
  let sql = "update ? set ? where clientId=?;";

  db(req.baseUrl).query(sql, [ mysql.raw(req.query.type), req.body, mysql.raw(req.query.clientId) ], (err, data) => {
    if (err) {
      logger.log({
        level: "error",
        message: err,
        protocol: req.protocol,
        route: req.originalUrl,
        timestamp: new Date()
      });
      throw err;
    };

    res.json({ message: "Details Successfully Updated." });
  });
});

router.get("/", (req, res) => {
  let options = {
    sql: `select * from accounting_details inner join expediting_details on accounting_details.clientId=expediting_details.clientId where accounting_details.clientId=?;`,
    nestTables: true
  };

  db(req.baseUrl).query(options, [ req.query.clientId ], (err, data) => {
    if (err) {
      logger.log({
        level: "error",
        message: err,
        protocol: req.protocol,
        route: req.originalUrl,
        timestamp: new Date()
      });
      throw err;
    };

    res.json({ tables: data[0] });
  });
});

module.exports = router;
