var express = require("express");
var router = express.Router({ mergeParams: true });
var mysql = require("mysql");

var db = require("../../db");

router.use("/addresses", require("./addresses"));
router.use("/contacts", require("./contacts"));
router.use("/details", require("./details"));
router.use("/pricing", require("./pricing"));
router.use("/programs", require("./programs"));

router.get("/:id/profile-data", (req, res) => {
  let sql = `
    select clients.id as clientId, name, shortName, territory, concat_ws(" ", firstName, lastName) as salesRep, email as salesRepEmail, phone as salesRepPhone, sageEmployeeNumber, sageUserId from clients join users u on clients.userId=u.id where clients.id=?;
    select type, CONCAT_WS(" ", address1, address2) address, city, state, zip from addresses where clientId=?;
    select name, title, phone, email from contacts where clientId=?;
    select lisak "Lisa Kallus", edythc "Edyth Cruz", kimn "Kim Conover", lastSubmittedAt from approvals where clientId=?;
    select cabinets "Cabinets", carpet "Carpet", countertops "Countertops", tile "Tile", wood "Wood", vinyl "Vinyl" from programs where clientId=?;
    select status current from status where clientId=?;
    select cabinets, carpet, countertops, tile, wood, vinyl from programs where clientId=?;
    `
  ;
  let params = Array(7).fill(req.params.id);

  db(req.baseUrl).query(sql, params, (err, data) => {
    if (err) {
      console.log(err);
    };

    res.json({
      basicInfo: data[0][0],
      addresses: data[1],
      contacts: data[2],
      approvals: data[3][0],
      programs: data[4][0],
      status: data[5][0],
      selections: data[6][0]
    });
  });
});

router.get("/", (req, res) => {
  let sql = `
  select 
    clients.id as clientId, users.id as userId, name, territory, createdAt, updatedAt, sageObjectId, sageEmployeeNumber
  from clients 
    join users on clients.userId=users.id;`;

  db(req.baseUrl).query(sql, (err, data) => {
    if (err) throw err;

    res.json({ clients: data });
  });
});

router.put("/status/:id", (req, res) => {
  let sql = `update approvals set ??=? where clientId=?;`;

  if (req.body.user !== "edythc" && req.body.user !== "kimn" && req.body.user !== "lisak") {
    res.json({ message: `${req.body.user} is a non-authorized user` });
  } else {
    db(req.baseUrl).query(sql, [ req.body.user, req.body.decision, req.params.id ], (err, data) => {
      if (err) throw err;

      res.send({ message: data });
    });
  }
});

router.get("/status/:id", (req, res) => {
  let sql = "select kimn, edythc, lisak from approvals where clientId=?;";

  db(req.baseUrl).query(sql, [ req.params.id ], (err, data) => {
    if (err) throw err;

    res.json({ approvals: data });
  })
});

module.exports = router;
