var express = require("express");
var router = express.Router( );
var mysql = require("mysql");

var db = require("../../db");

router.get("/:id", (req, res) => {
  let sql = "select * from clients where clientId=?;";

  db.query(sql, [ req.query.id], (err, data) => {
    if (err) throw err;

    res.json({ client: data });
  });
});

router.get("/", (req, res) => {
  let sql = `
  select 
    clients.id as clientId, users.id as userId, users.sageEmployeeNumber, name, territory, status.status, createdAt, clients.updatedAt, firstName, lastName, email, phone, status.remindAt 
  from clients 
    join users on clients.userId=users.id 
    join status on status.clientId=clients.id;`;

  db.query(sql, (err, data) => {
    if (err) throw err;

    res.json({ clients: data });
  });
});

router.put("/status", (req, res) => {
  let sql = "update approvals set ?=? where clientId=?;";

  db.query(sql, [ mysql.raw(req.query.user), mysql.raw(req.query.decision), req.query.clientId ], (err, data) => {
    if (err) throw err;

    res.json({ message: "Client Status Successfully Updated." });
  });
});

module.exports = router;