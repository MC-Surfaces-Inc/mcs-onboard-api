var express = require("express");
var router = express.Router({ mergeParams: true });

var db = require("../../db");

// Req .
router.get("/", (req, res) => {
  let carpetSQL = `select CONCAT_WS(" ", c.name, programTable, concat("Level ", level), description) as Description, program, unit as Unit, totalCost as BillingAmount
      from billing_parts
        join clients c on billing_parts.clientId = c.id
      where clientId=? and program="Carpet";
    `;
  let countertopsSQL = `select CONCAT_WS(" ", c.name, program, programTable, type, description) as Description, program, unit as Unit, totalCost as BillingAmount
      from billing_parts
        join clients c on c.id = billing_parts.clientId
      where clientId=? and program="Countertops";
     `;
  let tileSQL = `select CONCAT_WS(" ", c.name, programTable, CONCAT("T", level), description) as Description, program, unit as Unit, totalCost as BillingAmount
      from billing_parts
        join clients c on c.id = billing_parts.clientId
      where clientId=? and program="Tile";
    `;
  let lvpSQL = `select CONCAT_WS(" ", c.name, programTable, CONCAT("Level ", level), description) as Description, program, unit as Unit, totalCost as BillingAmount
      from billing_parts
        join clients c on c.id = billing_parts.clientId
      where clientId=? and program="LVP";
    `;
  let woodSQL = `select CONCAT_WS(" ", c.name, programTable, CONCAT("Level ", level), description) as Description, program, unit as Unit, totalCost as BillingAmount
      from billing_parts
        join clients c on c.id = billing_parts.clientId
      where clientId=? and program="Wood";
    `;
});

router.get("/:id", (req, res) => {
  let sql = "select * from billing_parts where clientId=?;";

  db.query(sql, [ req.params.id ], (err, data) => {
    if (err) throw err;

    res.json({ parts: data });
  });
});

module.exports = router;