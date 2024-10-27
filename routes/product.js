const express = require("express");
const router = express.Router();
const sql = require("better-sqlite3");
const db = sql("e-comerce.db");
const { checkAuth } = require("../util/auth");
const { readAction, deleteAction } = require("../CRUD/actions");
const { insertP } = require("../actions/productActions");
const { isCorret } = require("../helpers/validate");

router.get("/", async (req, res) => {
  const products = readAction("products", "id != ?", ["-1"]);
  const images = readAction("images", "item_id != ?", ["-1"]);
  res.status(200).json({ products, images });
});
router.get("/categories", async (req, res) => {
  const ret = db.prepare(`SELECT DISTINCT category FROM products`).all();
  res.status(200).json(ret);
});

router.get("/bycategories", async (req, res) => {
  const { category } = req.query;
  const images = [];
  let queryLen = "category = ?";
  let products = null;
  if (Array.isArray(category)) {
    queryLen = Array(category.length).fill("category = ?");
    queryLen = queryLen.toString().replaceAll(",", " OR ");
    products = readAction("products", `${queryLen}`, category);
    products.forEach((p) => {
      images.push(...readAction("images", `item_id=?`, [p.id]));
    });
  } else {
    products = readAction("products", `${queryLen}`, [category]);
    products.forEach((p) => {
      images.push(...readAction("images", `item_id=?`, [p.id]));
    });
  }

  if (products?.length > 0) {
    res.status(200).json({ products, images });
    return;
  } else {
    res.status(404).json({ message: `No product found` });
  }
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

router.post("/", (req, res) => {
  if (isCorret(11, req?.body) && req.body?.images.length >= 2) {
    const ret = insertP([req.body]);
    if (ret?.message) {
      res.status(400).json(ret);
      return;
    } else {
      // restore();
      res.status(201).json({ message: "Product created" });
      return;
    }
  } else {
    res.status(500).json({
      message: `Incomplete Body`,
    });
  }
});

router.delete("/", async (req, res) => {
  if (isCorret(1, req?.body)) {
    const id = req.body.id;
    deleteAction("images", "item_id=?", [id]);
    let ret = deleteAction("products", "id=?", [id]);

    if (ret.changes > 0) {
      // restore();
      res.status(200).json({ message: `Deleted product with id ${id}` });
      return;
    } else {
      res
        .status(404)
        .json({ message: `Could not delete product with id ${id}` });
    }
  } else {
    res.status(500).json({
      message: `Incomplete Body`,
    });
  }
});
module.exports = router;
