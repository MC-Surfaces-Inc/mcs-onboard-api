const express = require('express');
const axios = require("axios");
const { XMLParser } = require("fast-xml-parser");
const _ = require("lodash");

const router = express.Router( );

router.get("/okta-token", (req, res) => {
  let oktaDomain = process.env.OKTA_DOMAIN;
  let oktaEncoding = process.env.OKTA_ENCODING;
  let headers = {
    'accept': "application/json",
    'authorization': `Basic ${oktaEncoding}`,
    'cache-control': "no-cache",
    'content-type': "application/x-www-form-urlencoded"
  };

  // Get Access Token From Okta to call
  axios.post(oktaDomain, "grant_type=client_credentials&scope=OnBoard", { headers: headers })
    .then((response) => {
      let token = response.data.access_token;

      res.send(token);
    })
    .catch((error) => {
      console.error(error);
    });
});

// Body:
//        Client - info & contacts
// Headers:
//        Authorization - Bearer + token
router.post("/client", (req, res) => {
  let mcsDomainAPI = process.env.MCS_API;
  let client = req.body;
  let corpAddr = client.addresses.filter(address => address.type === "Corporate");
  let billingAddr = client.addresses.filter(address => address.type === "Billing");
  let shippingAddr = client.addresses.filter(address => address.type === "Shipping");
  let headers = {
    'Authorization': req.header('Authorization'),
  };

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

  // Create Client
  axios.post(`${mcsDomainAPI}/Client`, sageClient, { headers: headers })
    .then((response) => {
      res.send(response);
    })
    .catch((error) => {
      console.error(error);
    });
});

// Headers:
//        Authorization - Bearer + Okta Token
router.get("/partClass/last-class", (req, res) => {
  let partClasses;
  let mcsDomainAPI = process.env.MCS_API;
  let headers = {
    'Authorization': req.header('Authorization'),
  };

  axios.get(`${mcsDomainAPI}/PartClass`, { headers: headers })
    .then((response) => {
      let parser = new XMLParser({
        ignoreAttributes: false
      });

      let sageResponseJSON = parser.parse(response.data);
      partClasses = _.get(sageResponseJSON, "api:MBXML.MBXMLMsgsRs.SQLRunRs.xml.rs:data.rs:insert.z:row");

      res.send({
        Tile: parseInt(_.last(partClasses.filter((partClass) => partClass["@_ObjectID"] > 200 && partClass["@_ObjectID"] < 1000))["@_ObjectID"]) + 1,
        Countertops: parseInt(_.last(partClasses.filter((partClass) => partClass["@_ObjectID"] > 1001 && partClass["@_ObjectID"] < 1099))["@_ObjectID"]) + 1,
        Wood: parseInt(_.last(partClasses.filter((partClass) => partClass["@_ObjectID"] > 4001 && partClass["@_ObjectID"] < 4100))["@_ObjectID"]) + 1,
        Carpet: parseInt(_.last(partClasses.filter((partClass) => partClass["@_ObjectID"] > 7002 && partClass["@_ObjectID"] < 8000))["@_ObjectID"]) + 1
      });
    })
    .catch((error) => {
      console.error(error);
    });
});

// Body:
//        programs: Object of part class numbers
//        name    : Client Name
// Headers:
//        Authorization - Bearer + Okta Token
router.post("/PartClass", (req, res) => {
  let programs = req.body.programs;
  let clientName = req.body.name;
  let headers = {
    'Authorization': req.header('Authorization'),
  };

  // Create Part Classes (multiple calls, one per program)
  Object.keys(programs).forEach((program) => {
    let partClass = {
      info: {
        ObjectID: programs[program],
        Name: clientName,
        IndentLevel: 2
      }
    };

    axios.post(`${mcsDomainAPI}/PartClass`, partClass, { headers: headers })
      .then((response) => {
        res.send(response.status);
      })
      .catch((error) => {
        console.error(error);
      });
  });
});

// Body
//        billingParts  : Array of All Parts
//        partClasses   : Object of All New Part Classes
// Headers:
//        Authorization - Bearer + Okta Token
router.post("/Parts", (req, res) => {
  let mcsDomainAPI = process.env.MCS_API;
  let billingParts = req.body.billingParts;
  let partClasses = req.body.partClasses;
  let headers = {
    'Authorization': req.header('Authorization'),
  };

  // Add Part Class to Parts
  billingParts.forEach(part => {
    if (part.program === 'Tile') {
      part.PartClassRef = partClasses.Tile;
      part.Desc = part.Description;
      delete part.Description;
      delete part.program;
    }

    if (part.program === 'Carpet') {
      part.PartClassRef = partClasses.Carpet;
      part.Desc = part.Description;
      delete part.Description;
      delete part.program;
    }

    if (part.program === 'Countertops') {
      part.PartClassRef = partClasses.Countertops;
      part.Desc = part.Description;
      delete part.Description;
      delete part.program;
    }

    if (part.program === 'Wood' || part.program === 'LVP') {
      part.PartClassRef = partClasses.Wood;
      part.Desc = part.Description;
      delete part.Description;
      delete part.program;
    }
  });

  res.send(billingParts)

  // axios.post(`${mcsDomainAPI}/PartClass`, partClass, { headers: headers })
  //   .then((response) => {
  //     res.send(response.status);
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //   });
});

module.exports = router;