require('dotenv').config( );

const cookieParser = require("cookie-parser");
// const logger = require("morgan");
const cors = require("cors");
const express = require("express");

const path = require("path");

const indexRouter = require("./routes/v1/index");
const adminRouter = require("./routes/admin/index");

const app = express();

// app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors({ origin: "*" }));

app.use("/dev/v1", indexRouter);
app.use("/dev/admin", adminRouter);

app.use("/v1", indexRouter);
app.use("/admin", adminRouter);

module.exports = app;
