var express = require("express");
var router = express.Router({ mergeParams: true });
var mysql = require("mysql");

var db = require("../../db");

router.get("/", (req, res) => {
  let sql = "select *, concat_ws(' ', address1, address2) from addresses where clientId=?;";

  db.query(sql, [ req.param.clientId ], (err, data) => {
    if (err) throw err;

    res.json({ addresses: data });
  });
});

module.exports = router;