var express = require("express");
var router = express.Router( );
var mysql = require("mysql");

var db = require("../../db");

router.get("/", (req, res) => {
  let sql = "select * from billing_parts where clientId=?;";

  db.query(sql, [ req.param.clientId ], (err, data) => {
    if (err) throw err;

    res.json({ parts: data });
  });
});

module.exports = router;