require('dotenv').config( );

const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const express = require("express");
const cron = require("node-cron");

const path = require("path");

const indexRouter = require("./routes/v1/index");
const adminRouter = require("./routes/admin/index");
const db = require("./db");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors({ origin: "*" }));

// Scheduled job to poll database and send Slack notifications
cron.schedule('* * * * *', ( ) => {
   let sql = "select * from status join clients c on c.id = status.clientId;";

   db.query(sql, (err, data) => {
      let queuedClients = data.filter(client => client.status === "Queued");
      let declinedClients = data.filter(client => client.status === "Declined");
      let approvedClients = data.filter(client => client.status === "Approved");
      let pushedClients = data.filter(client => client.status === "Pushed");
   });
});

app.use("/v1", indexRouter);
app.use("/admin", adminRouter);

module.exports = app;