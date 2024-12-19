const express = require("express");
const router = express.Router({ mergeParams: true });
const axios = require("axios");

const db = require("../../db");
const logger = require("../common/Logging/logger");

router.get("/folder", async (req, res) => {
  // let sql = "update approvals set ? where clientId=?;";

  // db(req.baseUrl).query(sql, [ req.query.id ], (err, data) => {
  //   if (err) {
  //     logger.log({
  //       level: "error",
  //       message: err,
  //       protocol: req.protocol,
  //       route: req.originalUrl,
  //       timestamp: new Date()
  //     });
  //     throw err;
  //   };
  //
  //   res.json({ message: "Approval Submitted." });
  // });

  await axios.get(`${process.env.MCS_MICROSOFT_API_URL}/sharepoint/folder?id=${req.query.id}`)
    .then((response) => {
      res.status(200).json({ data: response.data.value });
    });
});

module.exports = router;