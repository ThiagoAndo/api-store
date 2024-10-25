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
router.get("/byid/:id", async (req, res) => {
  const id = req.params.id;
  const products = readAction("products", "id = ?", [id]);
  const images = readAction("images", "item_id = ?", [id]);
  products?.length
    ? res.status(200).json({ products, images })
    : res
        .status(404)
        .json({ message: `Could not find product with id: ${id}` });
});

router.use(checkAuth);

module.exports = router;
