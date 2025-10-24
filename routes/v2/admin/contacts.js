const express = require("express");
const router = express.Router({ mergeParams: true });

const db = require("../../../db");

router.get("/:id", (req, res) => {
  let sql = "select * from contacts where clientId=?;";

  db(req.baseUrl).query(sql, [ req.params.id ], (err, data) => {
    if (err) throw err;

    res.json({ contacts: data });
  });
});

module.exports = router;
