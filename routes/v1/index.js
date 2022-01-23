const express = require("express");
const router = express.Router();

const usersRouter = require("./users");
const clientsRouter = require("./clients");
const detailsRouter = require("./details");
const programsRouter = require("./programs");
const pricingRouter = require("./pricing");
const sageRouter = require("./sage");

router.use("/users", usersRouter);
router.use("/clients", clientsRouter);
router.use("/details", detailsRouter);
router.use("/programs", programsRouter);
router.use("/pricing", pricingRouter);
router.use("/sage", sageRouter);

/* GET home page. */
router.get("/", async function(req, res, next) {
  // const { sendSlackMessage } = require("../common/SlackMessages/slack");
  // const slackMessageResult = await sendSlackMessage("This is a test message. Please ignore.");
  //
  // res.send(slackMessageResult);

  res.render("index", { title: "Express" });
});

module.exports = router;
