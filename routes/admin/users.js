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

// User Query
router.get("/", (req, res) => {
  let sql = "select * from users where auth0Sub=?;";
  // if (req.query.sub === null) {
  //   continue();
  // }

  db(req.baseUrl).query(sql, [ req.query.sub ], (err, data) => {
    if (err) console.log(err);

    res.json(data[0]);
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
