var express = require("express");
var router = express.Router( );
var mysql = require("mysql");

var db = require("../../db");

router.use("/:clientId/contacts", require("./contacts"));
router.use("/:clientId/addresses", require("./addresses"));
router.use("/:clientId/details", require("./details"));
router.use("/:clientId/pricing", require("./pricing"));
router.use("/:clientId/programs", require("./programs"));

router.get("/", (req, res) => {
  let sql = "select * from clients inner join users on clients.id=users.id inner join status on status.clientId=users.id;";

  db.query(sql, (err, data) => {
    if (err) throw err;

    res.json({ clients: data });
  });
});

router.get("/:id", (req, res) => {
  let sql = "select * from clients where id=?;";

  db.query(sql, (err, data) => {
    if (err) throw err;

    res.json({ client: data });
  });
});

module.exports = router;