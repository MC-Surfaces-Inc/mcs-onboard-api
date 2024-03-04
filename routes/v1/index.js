const express = require("express");
const router = express.Router();
const path = require("path");

const usersRouter = require("./users");
const clientsRouter = require("./clients");
const detailsRouter = require("./details");
const programsRouter = require("./programs");
const pricingRouter = require("./pricing");
const sageRouter = require("./sage");
const { SlackMessages} = require("../common/SlackMessages/Messages");
const { findConversation, publishMessage } = require("../common/SlackMessages/slack");

router.use("/users", usersRouter);
router.use("/clients", clientsRouter);
router.use("/details", detailsRouter);
router.use("/programs", programsRouter);
router.use("/pricing", pricingRouter);
router.use("/sage", sageRouter);

/* GET home page. */
router.get("/", async function(req, res, next) {
  const conversation = await findConversation("onboard_notifications");
  const sendMessageResult = await publishMessage(
    conversation.channels[0].id,
    SlackMessages.queuedClient.blocks
  );

  res.send(sendMessageResult);
});

router.get("/privacy-policy", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/privacy_policy.html"));
});

module.exports = router;
