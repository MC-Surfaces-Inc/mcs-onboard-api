var express = require("express");
var router = express.Router({ mergeParams: true });
var mysql = require("mysql");

var db = require("../../db");

router.get("/selections/:id", (req, res) => {
  let sql = "select * from programs where clientId=?;";

  db.query(sql, [ req.params.id ], (err, data) => {
    if (err) throw err;

    res.json({ selections: data });
  });
});

router.get("/:id", (req, res) => {
  let sql = "select * from program_details_cabinets where clientId=?;";
  let sql2 = "select * from program_details_carpet where clientId=?;";
  let sql3 = "select * from program_details_countertops where clientId=?;";
  let sql4 = "select * from program_details_tile where clientId=?;";
  let sql5 = "select * from program_details_wood_vinyl where clientId=?;";
  let params = Array(5).fill(req.params.id);

  db.query(sql.concat(sql2, sql3, sql4, sql5), params, (err, data) => {
    if (err) throw err;

    res.json({ 
      programs: data,
      cabinets: data[0],
      carpet: data[1],
      countertops: data[2],
      tile: data[3],
      woodVinyl: data[4],
    });
  });
});

module.exports = router;