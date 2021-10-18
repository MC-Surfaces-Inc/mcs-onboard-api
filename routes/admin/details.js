var express = require("express");
var router = express.Router({ mergeParams: true });
var mysql = require("mysql");

var db = require("../../db");

router.get("/", (req, res) => {
  let sql = "select * from accounting_details where clientId=?;";
  let sql2 = "select * from expediting_details where clientId=?;";

  db.query(sql.concat(sql2), [ req.params.clientId, req.params.clientId ], (err, data) => {
    if (err) throw err;

    res.json({ accountingDetails: data[0], expeditingDetails: data[1] });
  });
});

module.exports = router;