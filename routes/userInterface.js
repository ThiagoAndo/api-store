const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("UserInterface.html");
});

module.exports = router;
