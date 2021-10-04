var express = require("express");
var router = express.Router( );
var mysql = require("mysql");

var db = require("../../db");

router.put("/", (req, res) => {
  let sql = "update programs set ? where clientId=?;";

  db.query(sql, [ req.body, req.query.clientId ], (err, data) => {
    if (err) throw err;

    res.json({ message: "Client Program Selections Updated Successfully." });
  });
}); 

router.get("/", (req, res) => {
  let sql = "select * from programs where clientId=?;";

  db.query(sql, [ req.query.clientId ], (err, data) => {
    if (err) throw err;

    res.json({ programs: data[0] });
  });
});

router.get("/info", (req, res) => {
  let program = mysql.raw(req.query.programName);
  let sql = `select * from program_details_? where clientId=?;`;

  db.query(sql, [ program, req.query.clientId ], (err, data) => {
    if (err) throw err;

    res.json({ data: data[0] });
  });
});

router.post("/info", (req, res) => {
  let program = mysql.raw(req.query.programName);
  let sql = `update program_details_? set ? where clientId=? on duplicate key update ?;`;

  db.query(sql, [ program, req.body, req.query.clientId, req.body ], (err, data) => {
    if (err) throw err;

    res.json({ message: "Client Program Specs. Update Successfully." });
  });
});

module.exports = router;