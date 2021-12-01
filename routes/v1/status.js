var express = require("express");
var router = express.Router({ mergeParams: true });
var mysql = require("mysql");
var db = require("../../db");

router.put("/", (req, res) => {
  const payload = {
    channel: "onboard"
  }
  let sql = "update status set ? where clientId=?;";

  if (req.body.status === "Pushed") {
    req.body.pushedAt = mysql.raw("current_timestamp( )");
  }

  db.query(sql, [ req.body, req.params.clientId ], (err, data) => {
    if (err) throw err;

    res.json({ message: "Client Status Updated." })
  });
});

router.get("/", (req, res) => {
  let sql = "select * from status where clientId=?;";

  db.query(sql, [ req.params.clientId ], (err, data) => {
    if (err) throw err;

    res.json({ status: data[0] });
  });
});

module.exports = router;