var express = require("express");
var router = express.Router({ mergeParams: true });
var mysql = require("mysql");

var db = require("../../db");

router.get("/", (req, res) => {
  let sql = `
    select paymentFrequency, autopay, invoiceEmailAddress, paymentType, paymentPortal, paymentURL, poRequired, poInvoiceRequired, approvalsRequired, contractAttached, contactName, contactPhone, contactEmail, notes from accounting_details where clientId=?; 
    select vendorPortal, vendorPortalURL, portalAccountCreated, portalUsername, portalPassword, jobReleaseMethod, poErrorHandling, estimatedHomes, estimatedStartDate, inHouseProgram, notes from expediting_details where clientId=?;
  `;

  db(req.baseUrl).query(sql, [ req.query.clientId, req.query.clientId ], (err, data) => {
    if (err) throw err;

    res.json({ accounting: data[0][0], expediting: data[1][0] });
  });
});

module.exports = router;
