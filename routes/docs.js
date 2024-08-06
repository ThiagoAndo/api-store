const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index.html");
});

router.get("/product", (req, res) => {
  res.render("products.html");
});
router.get("/user", (req, res) => {
  res.render("user.html");
});

router.get("/cart", (req, res) => {
  res.render("cart.html");
});

router.get("/address", (req, res) => {
  res.render("address.html");
});

router.get("/order", (req, res) => {
  res.render("order.html");
});

router.get("/c", (req, res) => {
  res.render("exp.html");
});

module.exports = router;
