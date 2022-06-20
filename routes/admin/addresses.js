var express = require("express");
var router = express.Router({ mergeParams: true });

var db = require("../../db");

router.get("/:id", (req, res) => {
  let sql = "select *, concat_ws(' ', address1, address2) as address from addresses where clientId=?;";

  db(req.baseUrl).query(sql, [ req.params.id ], (err, data) => {
    if (err) throw err;

    res.json({ addresses: data });
  });
});

module.exports = router;
