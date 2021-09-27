require('dotenv').config( );

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/v1/index");
var usersRouter = require("./routes/v1/users");
var clientsRouter = require("./routes/v1/clients");
var detailsRouter = require("./routes/v1/details");
var programsRouter = require("./routes/v1/programs");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/clients", clientsRouter);
app.use("/details", detailsRouter);
app.use("/programs", programsRouter);

module.exports = app;
