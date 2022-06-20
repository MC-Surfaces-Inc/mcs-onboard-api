const express = require("express");
const router = express.Router({ mergeParams: true });
const mysql = require("mysql");
const db = require("../../db");

router.put("/", (req, res) => {
  let sql = "update status set ? where clientId=?;";

  if (req.body.status === "Pushed") {
    req.body.pushedAt = mysql.raw("current_timestamp( )");
  }

  db(req.baseUrl).query(sql, [ req.body, req.params.clientId ], (err, data) => {
    if (err) throw err;

    res.json({ message: "Client Status Updated." })
  });
});

router.get("/", (req, res) => {
  let sql = "select * from status where clientId=?;";

  db(req.baseUrl).query(sql, [ req.params.clientId ], (err, data) => {
    if (err) throw err;

    res.json({ status: data[0] });
  });
});

module.exports = router;
