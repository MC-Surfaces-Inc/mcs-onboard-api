var express = require("express");
var router = express.Router({ mergeParams: true });
var mysql = require("mysql");

var db = require("../../db");

router.get("/", (req, res) => {
  let sql = "select * from accounting_details;";
  let sql2 = "select * from expediting_details;";

  db.query(sql.concat(sql2), (err, data) => {
    if (err) throw err;

    res.json({ details: data });
  });
});

module.exports = router;