const express = require("express");
const {
  readAction,
  createAction,
  updateAction,
  deleteAction,
} = require("../CRUD/actions");
const { rearranging } = require("../actions/cartAction");
const { isValid } = require("../util/inputCheck");
const router = express.Router();
const { checkAuth } = require("../util/auth");
const { isCorret } = require("../helpers/validate");
router.get("/:id", async (req, res) => {
  let items;
  let user_id = req.params.id;
  items = readAction("cart", "user_id=? AND bought=?", [user_id, 0]);
  items.length > 0
    ? res.status(200).json({ items })
    : res.status(404).json({ message: "Not found" });
});
router.use(checkAuth);
router.get("/purchased/params", async (req, res) => {
  let items;
  const { user_id, cart_id } = req.query;
  if (user_id && cart_id) {
    items = readAction("cart", "user_id=? AND bought=? AND creation_at=?", [
      user_id,
      1,
      cart_id,
    ]);
    items.length > 0
      ? res.status(200).json({ items })
      : res.status(404).json({ message: "Not found" });
    return;
  }
  res.status(404).json({ message: "Not found" });
});
router.post("/", async (req, res) => {
  /* 
  The function <isProduct> below would be unnecessary with a foreign key constraint in 
  the cart table pointing out to product id. However, as the API will restore itself after
         each request made to modify a product. It become necessary a logic changin in order to 
         restore the product table with the original data.
   */


  if (isCorret(2, req.body) && isCorret(4, req.body?.item)) {
    const data = rearranging(req.body);
    if (!isValid(data.item_id, data.user_id)) {
      res.status(200).json({
        message: `There is no pruduct with id: ${data.item_id} or User with id: ${data.user_id}`,
      });
      return;
    }
    const item = readAction("cart", "user_id=? AND bought=? AND item_id =?", [
      data.user_id,
      0,
      data.item_id,
    ]);
    if (item.length > 0) {
      res.status(200).json({
        message: `There is already a product with id: ${data.item_id} in the cart`,
      });
      return;
    } else {
      createAction("cart", { ...data });
      res.status(201).json({ message: "Cart created successufuly" });
    }
    return;
  } else {
    res.status(500).json({
      message: `Incomplete Body`,
    });
  }
});
router.patch("/", async (req, res) => {
  if (isCorret(3, req.body.cart)) {
    const { quantity, item_id, user_id } = req.body.cart;
    ret = updateAction("cart", "qnt = ?", "item_id = ? AND user_id=? ", [
      quantity,
      item_id,
      user_id,
    ]);
    ret?.changes
      ? res.status(200).json({ message: `Updated item with id ${item_id}` })
      : res.status(200).json({ message: `Not found` });
    return;
  } else {
    res.status(200).json({
      message: `Incomplete Body`,
    });
  }
});
router.delete("/", async (req, res) => {
  if (isCorret(1, req.body)) {
    let ret = deleteAction("cart", "user_id=? AND bought=?", [
      req.body.user_id,
      0,
    ]);
    ret?.changes
      ? res.status(200).json({ message: `Cart deleted` })
      : res.status(404).json({ message: `Not found` });
    return;
  } else {
    res.status(500).json({
      message: `Incomplete Body`,
    });
  }
});

router.delete("/item", async (req, res) => {
  if (isCorret(2, req.body.cart)) {
    let ret = deleteAction("cart", "item_id = ? AND user_id=?", [
      req.body.cart.item_id,
      req.body.cart.user_id,
    ]);
    ret?.changes
      ? res.status(200).json({ message: `Item deleted` })
      : res.status(404).json({ message: `Not found` });
    return;
  } else {
    res.status(500).json({
      message: `Incomplete Body`,
    });
  }
});
module.exports = router;
