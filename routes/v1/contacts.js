var express = require("express");
var router = express.Router({ mergeParams: true });

var db = require("../../db");

router.post("/", (req, res) => {
  let sql = "insert into contacts(clientId, name, title, phone, email) values ?;";

  db(req.baseUrl).query(sql, [ req.body ], (err, data) => {
    if (err) throw err;

    res.json({ message: "Contact Successfully Created." });
  });
});

router.get("/", (req, res) => {
  let sql = "select * from contacts where clientId=?;";

  db(req.baseUrl).query(sql, [ req.params.clientId ], (err, data) => {
    if (err) throw err;

    res.json({ contacts: data });
  });
});

router.get("/:id", (req, res) => {
  let sql = "select * from contacts where id=?;";

  db(req.baseUrl).query(sql, [ req.params.id ], (err, data) => {
    if (err) throw err;

    res.json({ contact: data[0] });
  });
});

router.put("/:id", (req, res) => {
  let sql = "update contacts set ? where id=?;";

  db(req.baseUrl).query(sql, [ req.body, req.params.id ], (err, data) => {
    if (err) throw err;

    res.json({ message: "Contact Successfully Updated." });
  });
});

router.delete("/:id", (req, res) => {
  let sql = "delete from contacts where id=?;";

  db(req.baseUrl).query(sql, [ req.params.id ], (err, data) => {
    if (err) throw err;

    res.json({ message: "Contact Successfully Deleted." });
  });
});

module.exports = router;
