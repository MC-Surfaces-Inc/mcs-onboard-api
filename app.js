require('dotenv').config( );

const cookieParser = require("cookie-parser");
// const logger = require("morgan");
const cors = require("cors");
const express = require("express");

const path = require("path");

// V1 Routers
const indexRouterV1 = require("./routes/v1/index");
const adminRouterV1 = require("./routes/admin/index");

// V2 Routers
const indexRouterV2 = require("./routes/v2/index");
const adminRouterV2 = require("./routes/v2/admin/index");

const app = express();

// app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

// V1 dev and production routes
app.use("/dev/v1", indexRouterV1);
app.use("/dev/admin", adminRouterV1);
app.use("/v1", indexRouterV1);
app.use("/admin", adminRouterV1);

// V1 dev and production routes
app.use("/dev/v2", indexRouterV2);
app.use("/dev/v2/admin", adminRouterV2);
app.use("/v2", indexRouterV2);
app.use("/v2/admin", adminRouterV2);

module.exports = app;
