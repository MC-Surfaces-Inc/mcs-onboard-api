const express = require("express");
const router = express.Router({ mergeParams: true });
const axios = require("axios");

router.get("/clients/:id", async (req, res) => {
  let clients = await axios.get(`${process.env.MCS_AIRTABLE_API}/Clients`, {
    headers: {
      "Authorization": `Bearer ${process.env.MCS_AIRTABLE_API_TOKEN}`,
    }
  });

  res.status(200).send({ clients: clients.data.records });
});

router.get("/clients", async (req, res) => {
  let clients = await axios.get(`${process.env.MCS_AIRTABLE_API}/Clients`, {
    headers: {
      "Authorization": `Bearer ${process.env.MCS_AIRTABLE_API_TOKEN}`,
    }
  });

  res.status(200).send({ clients: clients.data.records });
});

router.post("/clients", async (req, res) => {
  let body = {
    fields: {
      "Name": req.body.name,
      "Territory": req.body.territory,
      "Type": "Production",
      "Status": "Active",
      "SharePoint ID": req.body.sharepointId,
      "SharePoint URL": req.body.sharepointUrl,
      "Notes": "",
      "Sales Rep.": {
        "email": req.body.email
      }
    }
  };

  let response = await axios.post(`${process.env.MCS_AIRTABLE_API}/Clients`, body, {
    headers: {
      "Authorization": `Bearer ${process.env.MCS_AIRTABLE_API_TOKEN}`,
    }
  });

  res.status(200).send({ data: response.data });
});

module.exports = router;