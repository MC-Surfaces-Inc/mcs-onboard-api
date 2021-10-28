var express = require("express");
var router = express.Router({ mergeParams: true });
var mysql = require("mysql");

var db = require("../../db");

router.get("/", (req, res) => {
  let sql = "select * from billing_parts;";

  db.query(sql, (err, data) => {
    if (err) throw err;

    res.json({ parts: data });
  });
});

module.exports = router;