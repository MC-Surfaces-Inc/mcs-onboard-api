const express = require("express");
const router = express.Router();
const path = require("path");

const usersRouter = require("./users");
const clientsRouter = require("./clients");
const detailsRouter = require("./details");
const programsRouter = require("./programs");
const pricingRouter = require("./pricing");
const sharepointRouter = require("./sharepoint");
const airtableRouter = require("./airtable");

router.use("/users", usersRouter);
router.use("/clients", clientsRouter);
router.use("/details", detailsRouter);
router.use("/programs", programsRouter);
router.use("/pricing", pricingRouter);
router.use("/sharepoint", sharepointRouter);
router.use("/airtable", airtableRouter);

/* GET home page. */
router.get("/", async function(req, res, next) {
  res.send("Welcome to MCS - Client API");
});

router.get("/privacy-policy", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/privacy_policy.html"));
});

module.exports = router;
