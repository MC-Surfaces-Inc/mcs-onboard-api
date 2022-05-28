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
});

router.get("/parts", (req, res) => {
  let sql = "select * from billing_parts where clientId=? and program=?;";

  db.query(sql, [ req.query.clientId, req.query.program ], (err, data) => {
    if (err) throw err;

    res.json({ parts: data });
  });
});

router.post("/parts", (req, res) => {
  let sql = "insert into billing_parts set ? on duplicate key update ?;";

  db.query(sql, [ req.body, req.body ], (err, data) => {
    if (err) throw err;

    res.json({ message: "Client Billing Parts Successfully Created." });
  })
});

router.delete("/parts/:id", (req, res) => {
  let sql = "delete from billing_parts where id=?;";

  db.query(sql, [ req.params.id ], (err, data) => {
    if (err) throw err;

    res.json({ message: "Billing Part successfully deleted." });
  });
});

router.get("/in-house", (req, res) => {
  let sql = "select * from in_house_program;";

  db.query(sql, (err, data) => {
    if (err) throw err;

    res.json({ parts: data });
  });
});

module.exports = router;
