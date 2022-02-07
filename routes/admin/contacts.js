var express = require("express");
var router = express.Router({ mergeParams: true });
var mysql = require("mysql");

var db = require("../../db");

router.get("/:id", (req, res) => {
  let sql = "select * from contacts where clientId=?;";

  db.query(sql, [ req.params.id ], (err, data) => {
    if (err) throw err;

    res.json({ contacts: data });
  });
});

module.exports = router;