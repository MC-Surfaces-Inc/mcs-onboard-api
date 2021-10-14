var express = require("express");
var router = express.Router();

var clientsRouter = require("./clients");

router.use("/clients", clientsRouter);

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

module.exports = router;