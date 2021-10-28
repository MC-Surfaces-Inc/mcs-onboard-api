var express = require("express");
var router = express.Router({ mergeParams: true });
var mysql = require("mysql");

var db = require("../../db");

router.get("/selections", (req, res) => {
  let sql = "select * from programs;";

  db.query(sql, (err, data) => {
    if (err) throw err;

    res.json({ selections: data });
  });
});

router.get("/", (req, res) => {
  let sql = "select * from program_details_cabinets;";
  let sql2 = "select * from program_details_carpet;";
  let sql3 = "select * from program_details_countertops;";
  let sql4 = "select * from program_details_tile;";
  let sql5 = "select * from program_details_wood_vinyl;";

  db.query(sql.concat(sql2, sql3, sql4, sql5), (err, data) => {
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