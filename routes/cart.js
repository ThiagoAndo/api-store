const express = require("express");
const { readAction, createAction, updateAction } = require("../CRUD/actions");
const { rearranging, deleleteCart } = require("../actions/cartAction");
const { isValid } = require("../util/inputCheck");
const router = express.Router();
// require("../helpers/routeLock");
const { checkAuth } = require("../util/auth");

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
    items = readAction("cart", "user_id=? AND bought=? AND creation_at =?", [
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
  const id = req.body.item.id + "";
  const uId = req.body.id + "";
  /* 
  The function <isProduct> below would be unnecessary with a foreign key constraint in 
  the cart table pointing out to product id. However, as the API will restore itself after
         each request made to modify a product. It become necessary a logic changin in order to 
         restore the product table with the original data.
   */
  if (!isValid(id, uId)) {
    res.status(407).json({
      message: `There is no pruduct with id: ${id} or User with id: ${uId}`,
    });
    return;
  }
  const data = rearranging(req.body);
  if (data) {
    createAction("cart", { ...data });
    res.status(201).json({ message: "Cart created successufuly" });
    return;
  } else {
    res.status(407).json({
      message: `Incomplete Body`,
    });
  }
});
router.patch("/", async (req, res) => {
    const { qnt, item_id, user_id } = req.body.cart;
    ret = updateAction("cart", "qnt = ?", "item_id = ? AND user_id=? ", [
      qnt,
      item_id,
      user_id,
    ]);
    ret?.changes
      ? res.status(200).json({ message: `Updated item with id ${item_id}` })
      : res.status(404).json({ message: `Not found` });
});
router.delete("/", async (req, res) => {
    let ret = deleleteCart(req.body.op, req.body.cart);
    ret?.changes
      ? res.status(200).json({ message: `Cart deleted` })
      : res.status(404).json({ message: `Not found` });
});
module.exports = router;
