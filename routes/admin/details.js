var express = require("express");
var router = express.Router({ mergeParams: true });
var mysql = require("mysql");

var db = require("../../db");

router.get("/:id", (req, res) => {
  let sql = "select * from accounting_details where clientId=?;";
  let sql2 = "select * from expediting_details where clientId=?;";

  db.query(sql.concat(sql2), [ req.params.id, req.params.id ], (err, data) => {
    if (err) throw err;

    res.json({
      details: {
        accounting: data[0],
        expediting: data[1]
      }
    });
  });
});

module.exports = router;