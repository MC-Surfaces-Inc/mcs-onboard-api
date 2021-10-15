var express = require("express");
var router = express.Router( );
var mysql = require("mysql");

var db = require("../../db");

router.get("/", (req, res) => {
  let sql = "select * from accounting_details where clientId=?;";
  let sql2 = "select * from expediting_details where clientId=?;";

  db.query(sql.concat(sql2), [ req.param.clientId, req.param.clientId ], (err, data) => {
    if (err) throw err;

    res.json({ details: data });
  });
});

module.exports = router;