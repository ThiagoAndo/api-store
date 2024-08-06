const express = require("express");
const router = express.Router();
const sql = require("better-sqlite3");
const db = sql("e-comerce.db");
const { checkAuth } = require("../util/auth");
const { readAction } = require("../CRUD/actions");

router.get("/", async (req, res) => {
  const products = readAction("products", "id != ?", ["-1"]);
  const images = readAction("images", "item_id != ?", ["-1"]);
  res.status(200).json({ products, images });
});

router.use(checkAuth);

module.exports = router;
