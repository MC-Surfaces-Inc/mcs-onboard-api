var express = require("express");
var router = express.Router( );

var db = require("../../db");

router.post("/", (req, res) => {
  let sql = "insert into users set ?;";

  db(req.baseUrl).query(sql, [ req.body ], (err, data) => {
    if (err) throw err;

    res.json({ message: "User Successfully Created." });
  });
});

// Get all users
router.get("/", (req, res) => {
  let sql = "select * from users;"

  db(req.baseUrl).query(sql, (err, data) => {
    if (err) throw err;

    res.json({ users: data });
  });
});

// Update user
router.put("/:id", (req, res) => {
  let sql = "update users set ? where id=?;";

  db(req.baseUrl).query(sql, [ req.body, req.params.id ], (err, data) => {
    if (err) throw err;

    res.json({ message: "User Successfully Updated." });
  });
});

module.exports = router;
