var express = require("express");
var router = express.Router({ mergeParams: true });
var mysql = require("mysql");

var db = require("../../db");

router.get("/", (req, res) => {
  let sql = "select *, concat_ws(' ', address1, address2) as address from addresses;";

  db.query(sql, (err, data) => {
    if (err) throw err;

    res.json({ addresses: data });
  });
});

module.exports = router;