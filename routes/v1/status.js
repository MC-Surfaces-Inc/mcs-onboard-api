const express = require("express");
const router = express.Router({ mergeParams: true });
const mysql = require("mysql");
const db = require("../../db");
const {findConversation, publishMessage} = require("../common/SlackMessages/slack");
const {SlackMessages} = require("../common/SlackMessages/Messages");

router.put("/", (req, res) => {
  let sql = `
    select clients.id, firstName, lastName, name, territory from clients join users u on clients.userId = u.id where clients.id=?;
    select status current from status where clientId=?;
    select timesSubmitted, lastSubmittedAt from approvals where clientId=?;
    `
  ;
  let sql2 = "update status set ? where clientId=?;";

  if (req.body.status === "Queued") {
    db(req.baseUrl).query(sql, [req.params.clientId, req.params.clientId, req.params.clientId], async(err, data) => {
      if (err) throw err;

      const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const client = { ...data[0][0], ...data[1][0], ...data[2][0] };
      client.lastSubmittedAt = client.lastSubmittedAt.toLocaleDateString('en-us', dateOptions);
      const conversation = await findConversation("onboard_notifications");
      const sendMessageResult = await publishMessage(
        conversation.channels[0].id,
        SlackMessages.queuedClient.blocks(client)
      );

      console.log(sendMessageResult);
    });
  }

  if (req.body.status === "Pushed") {
    req.body.pushedAt = mysql.raw("current_timestamp( )");
  }

  db(req.baseUrl).query(sql2, [ req.body, req.params.clientId ], (err, data) => {
    if (err) throw err;

    res.json({ message: "Client Status Updated." })
  });
});

router.get("/", (req, res) => {
  let sql = "select * from status where clientId=?;";

  db(req.baseUrl).query(sql, [ req.params.clientId ], (err, data) => {
    if (err) throw err;

    res.json({ status: data[0] });
  });
});

module.exports = router;
