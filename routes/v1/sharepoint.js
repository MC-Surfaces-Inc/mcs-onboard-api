const express = require("express");
const router = express.Router({ mergeParams: true });
const axios = require("axios");

const db = require("../../db");
const logger = require("../common/Logging/logger");

router.get("/folder", async (req, res) => {
  await axios.get(`${process.env.MCS_MICROSOFT_API_URL}/sharepoint/folder?id=${req.query.id}`)
    .then((response) => {
      res.status(200).json({ data: response.data.value });
    });
});

router.post("/folder", async (req, res) => {
  await axios.post(`${process.env.MCS_MICROSOFT_API_URL}/sharepoint/folder?parentId=${req.query.id}&folder=${req.query.folder}`)
    .then((response) => {
      res.status(200).json({ message: "Successfully created folder" });
    });
});

module.exports = router;