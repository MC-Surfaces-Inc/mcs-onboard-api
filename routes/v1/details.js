var express = require("express");
var mysql = require("mysql");
var router = express.Router( );

var db = require("../../db");

router.put("/", (req, res) => {
  let sql = "update ? set ? where clientId=?;";
  
  db.query(sql, [ mysql.raw(req.query.type), req.body, mysql.raw(req.query.clientId) ], (err, data) => {
    if (err) throw err;

    res.json({ message: "Details Successfully Updated." });
  });
});

router.get("/", (req, res) => {
  let options = {
    sql: `select * from accounting_details inner join expediting_details on accounting_details.clientId=expediting_details.clientId where accounting_details.clientId=?;`,
    nestTables: true
  };

  db.query(options, [ req.query.clientId ], (err, data) => {
    if (err) throw err;

    res.json({ tables: data[0] });
  });
});

module.exports = router;