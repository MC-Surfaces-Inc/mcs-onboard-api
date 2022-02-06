var express = require("express");
var router = express.Router();

router.use("/clients", require("./clients"));
router.use("/contacts", require("./contacts"));
router.use("/addresses", require("./addresses"));
router.use("/details", require("./details"));
router.use("/pricing", require("./pricing"));
router.use("/programs", require("./programs"));

/* GET home page. */
// router.get("/", function(req, res, next) {
  // res.render("index", { title: "Express" });
// });

module.exports = router;