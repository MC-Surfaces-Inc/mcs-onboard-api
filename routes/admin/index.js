const express = require("express");
const router = express.Router();

router.use("/clients", require("./clients"));
router.use("/contacts", require("./contacts"));
router.use("/addresses", require("./addresses"));
router.use("/details", require("./details"));
router.use("/pricing", require("./pricing"));
router.use("/programs", require("./programs"));
// router.use("/sage", require("./sage"));
router.use("/users", require("./users"));

module.exports = router;
