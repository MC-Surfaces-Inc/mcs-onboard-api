var express = require("express");
var router = express.Router( );
var mysql = require("mysql");

var db = require("../../db");

router.use("/:clientId/contacts", require("./contacts"));
router.use("/:clientId/addresses", require("./addresses"));
router.use("/:clientId/approvals", require("./approvals"));
router.use("/:clientId/status", require("./status"));
router.use("/:clientId/files", require("./files"));

router.post("/", (req, res) => {
  let sql = "insert into clients set ?;";
  
  db.query(sql, [ req.body ], (err, data) => {
    if (err) throw err;

    res.json({ message: "Client Successfully Created.", data: data });
  });
});

// Get all of a users clients
router.get("/", (req, res) => {
  let sql = "select * from clients inner join status on clients.id=status.clientId where userId=?;";

  db.query(sql, [ req.query.userId ], (err, data) => {
    if (err) throw err;

    res.json({ clients: data});
  });
});

// Get a client by id
router.get("/:id", (req, res) => {
  let sql = "select * from clients where id=?;";

  db.query(sql, [ req.params.id ], (err, data) => {
    if (err) throw err;

    res.json({ client: data[0] });
  });
});

// Update a client
router.put("/:id", (req, res) => {
  let sql = "update clients set ? where id=?;";
  let newData = req.body;
  newData.updatedAt = mysql.raw("current_timestamp( )");
  
  db.query(sql, [ newData, req.params.id ], (err, data) => {
    if (err) throw err;

    res.json({ message: "Client Updated Successfully." });
  });
});

router.get("/:id/sage-create", (req, res) => {
  let sql = "select * from clients join users on clients.userId=users.id where clients.id=?;";
  let sql2 = "select * from addresses where clientId=?;";
  let sql3 = "select * from contacts where clientId=?;";
  let sql4 = "select * billing_parts where clientId=?;";

  let sqlParams = [ req.params.id, req.params.id, req.params.id, req.params.id ];

  db.query(sql.concat(sql2, sql3, sql4), sqlParams, (err, data) => {
    if (err) throw err;

    res.json({ data: data });
  })
});

module.exports = router;