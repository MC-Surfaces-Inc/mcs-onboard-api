var express = require("express");
var router = express.Router();

var usersRouter = require("./users");
var clientsRouter = require("./clients");
var detailsRouter = require("./details");
var programsRouter = require("./programs");
var pricingRouter = require("./pricing");

router.use("/users", usersRouter);
router.use("/clients", clientsRouter);
router.use("/details", detailsRouter);
router.use("/programs", programsRouter);
router.use("/pricing", pricingRouter);

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

module.exports = router;
