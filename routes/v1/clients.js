var express = require("express");
var router = express.Router( );
var mysql = require("mysql");
var axios = require("axios");

var db = require("../../db");

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
  let sql = "select * from clients inner join status on clients.id=status.clientId where userId=?;";

  db.query(sql, [ req.query.userId ], (err, data) => {
    if (err) throw err;

    res.json({ clients: data});
  });
});

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

router.get("/:id/sage-create", async(req, res) => {
  let oktaDomain = process.env.OKTA_DOMAIN;
  let oktaEncoding = process.env.OKTA_ENCODING;
  let mcsDomainAPI = process.env.MCS_API;
  let sql = "select * from clients join users on clients.userId=users.id where clients.id=?;";
  let sql2 = "select * from addresses where clientId=?;";
  let sql3 = "select * from contacts where clientId=?;";
  let sql4 = "select * from billing_parts where clientId=?;";
  let sqlParams = [ req.params.id, req.params.id, req.params.id, req.params.id ];
  let headers = {
    'accept': "application/json",
    'authorization': `Basic ${oktaEncoding}`,
    'cache-control': "no-cache",
    'content-type': "application/x-www-form-urlencoded"
  };

  db.query(sql.concat(sql2, sql3, sql4), sqlParams, (err, data) => {
    if (err) throw err;

    let client = {
      info: data[0][0],
      addresses: data[1],
      contacts: data[2],
      billingParts: data[3]
    };

    // let corpAddr = client.addresses.filter(address => address.type === "Corporate");
    // let billingAddr = client.addresses.filter(address => address.type === "Billing");
    // let shippingAddr = client.addresses.filter(address => address.type === "Shipping");

    // let sageClient = {
    //   info: {
    //     ShortName: client.info.shortName,
    //     Name: client.info.name,
    //     Addr1: corpAddr[0].address1,
    //     Addr2: corpAddr[0].address2,
    //     City: corpAddr[0].city,
    //     State: corpAddr[0].state,
    //     PostalCode: corpAddr[0].zip,
    //     BillingAddr1: billingAddr[0].address1,
    //     BillingAddr2: billingAddr[0].address2,
    //     BillingCity: billingAddr[0].city,
    //     BillingState: billingAddr[0].state,
    //     BillingPostalCode: billingAddr[0].zip,
    //     ShippingAddr1: shippingAddr[0].address1,
    //     ShippingAddr2: shippingAddr[0].address2,
    //     ShippingCity: shippingAddr[0].city,
    //     ShippingState: shippingAddr[0].state,
    //     ShippingPostalCode: shippingAddr[0].zip,
    //     SalespersonRef: client.info.employeeNumber,
    //     ManagerRef: client.info.arSpecialist,
    //     ClientTypeRef: 1,
    //     ClientStatusRef: 1
    //   },
    //   billingParts: [],
    //   contacts: client.contacts.map(contact => {
    //     return {
    //       ContactName: contact.name,
    //       JobTitle: contact.title,
    //       Phone: contact.phone,
    //       Email: contact.email
    //     }
    //   })
    // };

    // client.billingParts.forEach(row => {
    //   if (row.program === "Carpet" || row.program === "Wood" || row.program === "LVP") {
    //     if (row.programTable === "Miscellaneous" || row.programTable === "Carpet Pad") {
    //       sageClient.billingParts.push({
    //         description: `${client.info.name} ${row.program} - ${row.programTable} - ${row.description}`,
    //         unit: row.unit || "SqFt",
    //         billingAmount: row.totalCost,
    //       });

    //       return;
    //     }

    //     sageClient.billingParts.push({
    //       description: `${client.info.name} ${row.programTable} Level ${row.level}`,
    //       unit: row.unit || "SqFt",
    //       billingAmount: row.totalCost,
    //     });
    //   }

    //   if (row.program === "Countertops") {
    //     if (row.programTable === "Edges" || row.programTable === "Sinks" || row.programTable === "Miscellaneous") {
    //       sageClient.billingParts.push({
    //         description: `${client.info.name} ${row.program} - ${row.programTable} - ${row.description || row.type}`,
    //         unit: row.unit || "SqFt",
    //         billingAmount: row.totalCost
    //       });

    //       return; 
    //     }

    //     sageClient.billingParts.push({
    //       description: `${client.info.name} ${row.program} - ${row.programTable} ${row.type}`,
    //       unit: row.unit || "SqFt",
    //       billingAmount: row.totalCost
    //     });
    //   }

    //   if (row.program === "Tile") {
    //     if (row.programTable === "Patterns" || row.programTable === "Accents" || row.programTable === "Bath Accessories" || row.programTable === "Miscellaneous") {
    //       sageClient.billingParts.push({
    //         description: `${client.info.name} ${row.program} - ${row.programTable} - ${row.description}`,
    //         unit: row.unit || "SqFt",
    //         billingAmount: row.totalCost
    //       });

    //       return;
    //     }

    //     sageClient.billingParts.push({
    //       description: `${client.info.name} ${row.program} - ${row.programTable} Level ${row.level}`,
    //       unit: row.unit || "SqFt",
    //       billingAmount: row.totalCost
    //     });
    //   }
    // });


    axios.post(oktaDomain, "grant_type=client_credentials&scope=OnBoard", { headers: headers })
      .then((response) => {
        let token = response.data.access_token;
        axios.get(`${mcsDomainAPI}/api/Client/137`, { headers: { 'authorization': `Bearer ${token}`}})
          .then((response) => {
            console.log(response)
          })
      })
      .catch((error) => {
        console.error(error);
      });
    
    // res.json({
    //   message: "Successfully Pushed to Sage.", 
    //   data: sageClient,
    //   status: 200 
    // });
  });
});

module.exports = router;