var express = require("express");
var router = express.Router({ mergeParams: true });
var mysql = require("mysql");

var db = require("../../db");

router.get("/", (req, res) => {
  let sql = "select * from program_details_cabinets where clientId=?;";
  let sql2 = "select * from program_details_carpet where clientId=?;";
  let sql3 = "select * from program_details_countertops where clientId=?;";
  let sql4 = "select * from program_details_tile where clientId=?;";
  let sql5 = "select * from program_details_wood_vinyl where clientId=?;";

  db.query(sql.concat(sql2, sql3, sql4, sql5), [ req.params.clientId, req.params.clientId, req.params.clientId, req.params.clientId, req.params.clientId ], (err, data) => {
    if (err) throw err;

    res.json({ programs: data });
  });
});

module.exports = router;