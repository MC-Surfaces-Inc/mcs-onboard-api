var express = require("express");
var router = express.Router({ mergeParams: true });
var mysql = require("mysql");

var db = require("../../db");

router.get("/", (req, res) => {
  let options = {
    sql: `select * from accounting_details inner join expediting_details on accounting_details.clientId=expediting_details.clientId where accounting_details.clientId=?;`,
    nestTables: true
  };

  db(req.baseUrl)(options, [ req.query.clientId ], (err, data) => {
    if (err) throw err;

    res.json({ tables: data[0] });
  });
});

module.exports = router;
