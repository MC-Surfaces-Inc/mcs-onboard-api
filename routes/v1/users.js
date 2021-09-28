var express = require("express");
var router = express.Router( );
var mysql = require("mysql");

var db = require("../../db");

router.post("/", (req, res) => {
  let sql = "insert into users set ?;";

  db.query(sql, [ req.body ], (err, data) => {
    if (err) throw err;

    res.json({ message: "User Successfully Created." });
  }); 
});

// Get all users
router.get("/", (req, res) => {
  let sql = "select * from users;"

  db.query(sql, (err, data) => {
    if (err) throw err;

    res.json({ users: data });
  });
});

// User Query
router.get("/", (req, res) => {
  let sql = "select * from users where email=?;";

  db.query(sql, [ req.query.email ], (err, data) => {
    if (err) console.log(err);

    res.json({ user: data[0] });
  });
});

// Update user
router.put("/:id", (req, res) => {
  let sql = "update users set ? where id=?;";

  db.query(sql, [ req.body, req.params.id ], (err, data) => {
    if (err) throw err;

    res.json({ message: "User Successfully Updated." });
  });
});

module.exports = router;
