var express = require("express");
var router = express.Router( );
var mysql = require("mysql");

var db = require("../../db");

// router.use("/:clientId/contacts", require("./contacts"));
// router.use("/:clientId/addresses", require("./addresses"));
// router.use("/:clientId/approvals", require("./approvals"));
// router.use("/:clientId/status", require("./status"));
// router.use("/:clientId/files", require("./files"));

router.get("/", (req, res) => {
  let sql = "select * from clients inner join users on clients.id=users.id;";

  db.query(sql, (err, data) => {
    if (err) throw err;

    res.json({ clients: data });
  })
});

module.exports = router;