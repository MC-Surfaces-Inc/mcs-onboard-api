var express = require("express");
var router = express.Router( );

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

module.exports = router;