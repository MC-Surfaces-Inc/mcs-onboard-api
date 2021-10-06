var express = require("express");
var router = express.Router( );
var mysql = require("mysql");

var db = require("../../db");

router.get("/", (req, res) => {
  let sql = "select * from billing_parts where clientId=?;";

  db.query(sql, [ req.query.clientId ], (err, data) => {
    if (err) throw err;

    res.json({ programs: data[0] });
  });
});

router.get("/countertop_options", (req, res) => {
  let sql = "select type from countertop_options group by type;";
  let sql2 = "select color from countertop_options order by color;";

  db.query(sql.concat(sql2), (err, data) => {
    if (err) throw err;

    res.json({ types: data[0], colors: data[1] });
  });
})

module.exports = router;