const express = require("express");
const router = express.Router( );
const mysql = require("mysql");
const axios = require("axios");
const _ = require("lodash");
const { XMLParser } = require("fast-xml-parser");

const db = require("../../db");

router.use("/:clientId/contacts", require("./contacts"));
router.use("/:clientId/addresses", require("./addresses"));
router.use("/:clientId/approvals", require("./approvals"));
router.use("/:clientId/status", require("./status"));
router.use("/:clientId/files", require("./files"));

router.post("/", (req, res) => {
  let sql = "insert into clients set ?;";

  db.query(sql, [ req.body ], (err, data) => {
    if (err) throw err;

    res.json({ message: "Client Successfully Created.", data: data });
  });
});

// Get all of a users clients
router.get("/", (req, res) => {
  let sql = "select * from clients inner join status on clients.id=status.clientId where userId=?;";;
  if (req.query.userId === "1") {
    sql = "select * from clients inner join status on clients.id=status.clientId inner join users on clients.userId=users.id;";
  }

  db.query(sql, [ req.query.userId ], (err, data) => {
    if (err) throw err;

    res.json({ clients: data});
  });
});

// Get all of a client's data
// router.get("/:id/compile-data", (req, res) => {
//   let sql = "select * from clients join users on clients.userId=users.id where clients.id=?;";
//   let sql2 = "select * from addresses where clientId=?;";
//   let sql3 = "select * from contacts where clientId=?;";
//   let sql4 = "select * from programs where clientId=?;";
//   let carpetSQL = `select CONCAT_WS(" ", c.name, programTable, concat("Level ", level), description) as Description, program, unit as Unit, totalCost as BillingAmount
//       from billing_parts
//         join clients c on billing_parts.clientId = c.id
//       where clientId=? and program="Carpet";
//     `;
//   let countertopsSQL = `select CONCAT_WS(" ", c.name, program, programTable, type, description) as Description, program, unit as Unit, totalCost as BillingAmount
//       from billing_parts
//         join clients c on c.id = billing_parts.clientId
//       where clientId=? and program="Countertops";
//      `;
//   let tileSQL = `select CONCAT_WS(" ", c.name, programTable, CONCAT("T", level), description) as Description, program, unit as Unit, totalCost as BillingAmount
//       from billing_parts
//         join clients c on c.id = billing_parts.clientId
//       where clientId=? and program="Tile";
//     `;
//   let lvpSQL = `select CONCAT_WS(" ", c.name, programTable, CONCAT("Level ", level), description) as Description, program, unit as Unit, totalCost as BillingAmount
//       from billing_parts
//         join clients c on c.id = billing_parts.clientId
//       where clientId=? and program="LVP";
//     `;
//   let woodSQL = `select CONCAT_WS(" ", c.name, programTable, CONCAT("Level ", level), description) as Description, program, unit as Unit, totalCost as BillingAmount
//       from billing_parts
//         join clients c on c.id = billing_parts.clientId
//       where clientId=? and program="Wood";
//     `;
//   let sqlParams = Array(10).fill(req.params.id, 0, 10);
//
//   // Query Application DB for Client Data
//   db.query(sql.concat(sql2, sql3, sql4, carpetSQL, countertopsSQL, tileSQL, lvpSQL, woodSQL), sqlParams, async (err, data) => {
//     if (err) throw err;
//
//     let client = {
//       info: data[0][0],
//       addresses: data[1],
//       contacts: data[2],
//       programs: data[3][0],
//       billingParts: data[4].concat(data[5], data[6], data[7], data[8])
//     };
//
//     res.send(client);
//   });
// });

// router.get("/:id/profile-data", (req, res) => {
//   let sql = `
//     select name, shortName, territory from clients where id=?;
//     select type, address1, address2, city, state, zip from addresses where clientId=?;
//     select name, title, phone, email from contacts where clientId=?;
//     select lisak "Lisa Kallus", edythc "Edyth Cruz", kimc "Kim Conover" from approvals where clientId=?;
//     select cabinets "Cabinets", carpet "Carpet", countertops "Countertops", tile "Tile", wood "Wood", vinyl "Vinyl" from programs where clientId=?;
//     select status current from status where clientId=?;
//     `
//   ;
//   let params = Array(6).fill(req.params.id);
//
//   db.query(sql, params, (err, data) => {
//     if (err) throw err;
//
//     res.json({
//       basicInfo: data[0][0],
//       addresses: data[1],
//       contacts: data[2],
//       approvals: data[3][0],
//       programs: data[4][0],
//       status: data[5][0]
//     });
//   });
// });

// Get a client by id
router.get("/:id", (req, res) => {
  let sql = "select * from clients where id=?;";

  db.query(sql, [ req.params.id ], (err, data) => {
    if (err) throw err;

    res.json({ client: data[0] });
  });
});

// Update a client
router.put("/:id", (req, res) => {
  let sql = "update clients set ? where id=?;";
  let newData = req.body;
  newData.updatedAt = mysql.raw("current_timestamp( )");

  db.query(sql, [ newData, req.params.id ], (err, data) => {
    if (err) throw err;

    res.json({ message: "Client Updated Successfully." });
  });
});

module.exports = router;
