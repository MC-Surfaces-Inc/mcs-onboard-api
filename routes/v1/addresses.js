var express = require("express");
var router = express.Router({ mergeParams: true });

var db = require("../../db");

router.post("/", (req, res) => {
  let sql = "insert into addresses(clientId, type, address1, address2, city, state, zip) values ?;";

  db.query(sql, req.body, (err, data) => {
    if (err) throw err;

    res.json({ message: "Address Successfully Created." });
  });
});

router.get("/", (req, res) => {
  let sql = "select *, CONCAT_WS(' ', address1, address2) as address from addresses where clientId=?;";

  db.query(sql, [ req.params.clientId ], (err, data) => {
    if (err) throw err;

    res.json({ addresses: data });
  });
});

router.get("/:id", (req, res) => {
  let sql = "select * from addresses where id=?;";

  db.query(sql, [ req.params.id ], (err, data) => {
    if (err) throw err;

    res.json({ address: data[0] });
  }); 
});

router.put("/:id", (req, res) => {
  let sql = "insert into addresses set ? on duplicate key update set ?;";

  db.query(sql, [ req.body, req.body ], (err, data) => {
    if (err) throw err;

    res.json({ message: "Address Successfully Updated." });
  }); 
});

router.delete("/:id", (req, res) => {
  let sql = "delete from addresses where id=?;";

  db.query(sql, [ req.params.id ], (err, data) => {
    if (err) throw err;

    res.json({ message: "Address Successfully Deleted." });
  });
}); 

module.exports = router;