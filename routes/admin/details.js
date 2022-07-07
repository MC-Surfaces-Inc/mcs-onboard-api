var express = require("express");
var router = express.Router({ mergeParams: true });
var mysql = require("mysql");

var db = require("../../db");

router.get("/", (req, res) => {
  let options = {
    sql: `
      select * from accounting_details where clientId=?;
      select * from expediting details where clientId=?;
    `,
    nestTables: true
  };

  db(req.baseUrl).query(options, [ req.query.clientId, req.query.clientId ], (err, data) => {
    if (err) throw err;

    res.json({ tables: data[0] });
  });
});

module.exports = router;
