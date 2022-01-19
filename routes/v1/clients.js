var express = require("express");
var router = express.Router( );
var mysql = require("mysql");
var axios = require("axios");
var _ = require("lodash");
var { XMLParser } = require("fast-xml-parser");

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

// Create a Client in Sage 
router.get("/:id/sage-create", async (req, res) => {
  let mcsDomainAPI = process.env.MCS_API;
  let sql = "select * from clients join users on clients.userId=users.id where clients.id=?;";
  let sql2 = "select * from addresses where clientId=?;";
  let sql3 = "select * from contacts where clientId=?;";
  let sql4 = "select * from programs where clientId=?;";
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

  let sqlParams = Array(10).fill(req.params.id, 0, 10);
  let responses = [];

  // Retrieve Valid Token from Okta to call 
  const getValidToken = async( ) => {
    let oktaDomain = process.env.OKTA_DOMAIN;
    let oktaEncoding = process.env.OKTA_ENCODING;
    let headers = {
      'accept': "application/json",
      'authorization': `Basic ${oktaEncoding}`,
      'cache-control': "no-cache",
      'content-type': "application/x-www-form-urlencoded"
    };

    // Get Access Token From Okta to call
    let token;
    await axios.post(oktaDomain, "grant_type=client_credentials&scope=OnBoard", { headers: headers })
      .then((response) => {
        token = response.data.access_token;
      })
      .catch((error) => {
        console.error(error);
      });
    
    return token;
  }

  // Query Application DB for Client Data
  db.query(sql.concat(sql2, sql3, sql4, carpetSQL, countertopsSQL, tileSQL, lvpSQL, woodSQL), sqlParams, async (err, data) => {
    if (err) throw err;

    let client = {
      info: data[0][0],
      addresses: data[1],
      contacts: data[2],
      programs: data[3][0],
      billingParts: data[4].concat(data[5], data[6], data[7], data[8])
    };

    let corpAddr = client.addresses.filter(address => address.type === "Corporate");
    let billingAddr = client.addresses.filter(address => address.type === "Billing");
    let shippingAddr = client.addresses.filter(address => address.type === "Shipping");

    let sageClient = {
      info: {
        ShortName: client.info.name,
        Name: client.info.name,
        Addr1: corpAddr[0].address1,
        Addr2: corpAddr[0].address2,
        City: corpAddr[0].city,
        State: corpAddr[0].state,
        PostalCode: corpAddr[0].zip,
        BillingAddr1: billingAddr.length !== 0 ? billingAddr[0].address1 : "",
        BillingAddr2: billingAddr.length !== 0 ? billingAddr[0].address2 : "",
        BillingCity: billingAddr.length !== 0 ? billingAddr[0].city : "",
        BillingState: billingAddr.length !== 0 ? billingAddr[0].state : "",
        BillingPostalCode: billingAddr.length !== 0 ? billingAddr[0].zip : "",
        ShippingAddr1: shippingAddr.length !== 0 ? shippingAddr[0].address1 : "",
        ShippingAddr2: shippingAddr.length !== 0 ? shippingAddr[0].address2 : "",
        ShippingCity: shippingAddr.length !== 0 ? shippingAddr[0].city : "",
        ShippingState: shippingAddr.length !== 0 ? shippingAddr[0].state : "",
        ShippingPostalCode: shippingAddr.length !== 0 ? shippingAddr[0].zip : "",
        SalespersonRef: client.info.employeeNumber,
        ManagerRef: client.info.arSpecialist,
        ClientTypeRef: 1,
        ClientStatusRef: 1
      },
      billingParts: client.billingParts,
      contacts: client.contacts.map(contact => {
        return {
          ContactName: contact.name,
          JobTitle: contact.title,
          Phone: contact.phone,
          Email: contact.email
        }
      }),
    };

    let token = await getValidToken( );
    headers = {
      'Authorization': 'Bearer ' + token,
    };

    // Create Client
    await axios.post(`${mcsDomainAPI}/Client`, sageClient, { headers: headers })
      .then((response) => {
        responses.push(response.status)
      })
      .catch((error) => {
        console.error(error);
      });

    // Get Next Available Part Classes per Program
    let partClasses;
    let partClassAttrs;
    await axios.get(`${mcsDomainAPI}/PartClass`, { headers: headers })
      .then((response) => {
        let parser = new XMLParser({
          ignoreAttributes: false
        });
        let sageResponseJSON = parser.parse(response.data);
        partClasses = _.get(sageResponseJSON, "api:MBXML.MBXMLMsgsRs.SQLRunRs.xml.rs:data.rs:insert.z:row");
        partClassAttrs = _.get(sageResponseJSON, "api:MBXML.MBXMLMsgsRs.SQLRunRs.xml.s:Schema.s:ElementType.s:AttributeType");

        responses.push(response.status)
      })
      .catch((error) => {
        console.error(error);
      });

    let lastTileProgram = _.last(partClasses.filter((partClass) => partClass["@_ObjectID"] > 200 && partClass["@_ObjectID"] < 1000));
    let lastGraniteProgram = _.last(partClasses.filter((partClass) => partClass["@_ObjectID"] > 1001 && partClass["@_ObjectID"] < 1099));
    let lastWoodProgram = _.last(partClasses.filter((partClass) => partClass["@_ObjectID"] > 4001 && partClass["@_ObjectID"] < 4100));
    let lastCarpetProgram = _.last(partClasses.filter((partClass) => partClass["@_ObjectID"] > 7002 && partClass["@_ObjectID"] < 8000));

    let countertopPartClass;
    let tilePartClass;
    let carpetPartClass;
    let woodPartClass;

    // Create Part Classes (multiple calls, one per program)
    await Object.keys(client.programs).forEach(async (program) => {
      if (client.programs[program] === 0 || program === "clientId" || program === "cabinets" || program === "vinyl") {
        return;
      }

      let newPartClass;
      if (program === "tile") {
        newPartClass = parseInt(lastTileProgram["@_ObjectID"]) + 1;
        tilePartClass = newPartClass;
      }

      if (program === "carpet") {
        newPartClass = parseInt(lastCarpetProgram["@_ObjectID"]) + 1;
        carpetPartClass = newPartClass;
      }

      if (program === "countertops") {
        newPartClass = parseInt(lastGraniteProgram["@_ObjectID"]) + 1;
        countertopPartClass = newPartClass;
      }

      if (program === "wood") {
        newPartClass = parseInt(lastWoodProgram["@_ObjectID"]) + 1;
        woodPartClass = newPartClass;
      }

      let partClass = {
        info: {
          ObjectID: newPartClass,
          Name: sageClient.info.Name,
          IndentLevel: 2
        }
      };

      await axios.post(`${mcsDomainAPI}/PartClass`, partClass, { headers: headers })
        .then((response) => {
          responses.push(response.status)
        })
        .catch((error) => {
          console.error(error);
        });
    });

    // Add Part Class to Parts
    client.billingParts.forEach(part => {
      if (part.program === 'Tile') {
        part.PartClassRef = tilePartClass;
        part.Desc = part.Description;
        delete part.Description;
        delete part.program;
      }

      if (part.program === 'Carpet') {
        part.PartClassRef = carpetPartClass;
        part.Desc = part.Description;
        delete part.Description;
        delete part.program;
      }

      if (part.program === 'Countertops') {
        part.PartClassRef = countertopPartClass;
        part.Desc = part.Description;
        delete part.Description;
        delete part.program;
      }

      if (part.program === 'Wood' || part.program === 'LVP') {
        part.PartClassRef = woodPartClass;
        part.Desc = part.Description;
        delete part.Description;
        delete part.program;
      }
    });

    // Create Parts (one call for all parts)
    await axios.post(`${mcsDomainAPI}/Parts`, sageClient.billingParts, { headers: headers })
      .then((response) => {
        responses.push(response.status)
      })
      .catch((error) => {
        console.error(error);
      });

    // Need to have accurate responses for all API calls
    responses.forEach((response) => {
      if (response < 200 || response > 299) {
        res.send({
          status: 500,
          message: `There was an error pushing ${sageClient.info.Name} to Sage.`
        });
      }
    });

    res.send({
      status: 200,
      message: `${sageClient.info.Name} was successfully pushed to Sage.`
    });
  });
});

module.exports = router;