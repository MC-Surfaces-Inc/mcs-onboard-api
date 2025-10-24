const express = require("express");
const router = express.Router({ mergeParams: true });
const axios = require("axios");
const multer = require("multer");
const FormData = require("form-data");

const db = require("../../db");
const logger = require("../common/Logging/logger");

const upload = multer();

router.post("/folder/internal", async (req, res) => {
  let sql = "insert into folder set ?;";
  let sql2 = "update clients set folderId=? where id=?;";
  let body = {
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  await db(req.baseUrl).query(sql, body, (err, results) => {
    if (err) {
      logger.log({
        level: "error",
        message: err,
        protocol: req.protocol,
        route: req.originalUrl,
        timestamp: new Date()
      });
      throw err;
    }

    db(req.baseUrl).query(sql2, [results.insertId, body.clientId], (err, data) => {
      if (err) {
        logger.log({
          level: "error",
          message: err,
          protocol: req.protocol,
          route: req.originalUrl,
          timestamp: new Date()
        });
        throw err;
      }

      res.status(200).send({ message: "Successfully saved" });
    });
  });
})

router.get("/folder", async (req, res) => {
  await axios.get(`${process.env.MCS_MICROSOFT_API_URL}/sharepoint/folder?id=${req.query.id}`)
    .then((response) => {
      res.status(200).json(response.data.value);
    });
});

router.post("/folder", async (req, res) => {
  try {
    await axios.post(`${process.env.MCS_MICROSOFT_API_URL}/sharepoint/folder?parentId=${req.query.parentId}&folder=${req.query.folder}`)
      .then((response) => {
        res.status(200).json(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
  } catch (error) {
    console.log(error);
  }
});

router.post("/file", upload.single('file'), async (req, res) => {
  const formData = new FormData();
  formData.append("file", req.file.buffer, req.file.originalname);

  try {
    await axios.post(`${process.env.MCS_MICROSOFT_API_URL}/sharepoint/file?parentId=${req.query.parentId}`, formData.getBuffer(), {
      headers: {
        ...formData.getHeaders()
      }
    })
      .then((response) => {
        res.status(200).json(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;