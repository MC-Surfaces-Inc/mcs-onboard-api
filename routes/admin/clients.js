var express = require("express");
var router = express.Router({ mergeParams: true });
var mysql = require("mysql");

var db = require("../../db");

router.use("/addresses", require("./addresses"));
router.use("/contacts", require("./contacts"));
router.use("/details", require("./details"));
router.use("/pricing", require("./pricing"));
router.use("/programs", require("./programs"));

router.get("/:id", (req, res) => {
  let sql = "select * from clients where id=?;";

  db.query(sql, [ req.params.id ], (err, data) => {
    if (err) throw err;

    res.json({ info: data[0] });
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

router.get("/status/:id", (req, res) => {
  let sql = "select kimc, edythc, lisak from approvals where clientId=?;";

  db.query(sql, [ req.params.id ], (err, data) => {
    if (err) throw err;

    res.json({ approvals: data });
  })
});

router.put("/status/:id", (req, res) => {
  let sql = "update approvals set ?=? where clientId=?;";

  if (req.body.user)

  db.query(sql, [ req.body.user, req.body.decision, req.params.id ], (err, data) => {
    if (err) throw err;

    res.json({ message: "Client Status Successfully Updated." });
  });
});

module.exports = router;