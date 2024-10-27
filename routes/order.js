const express = require("express");
const router = express.Router();
const { readAction } = require("../CRUD/actions");
const { insertOrder } = require("../actions/orderActions");
// require("../helpers/routeLock");
const { checkAuth } = require("../util/auth");
const { isName, isEmail } = require("../helpers/validate");
const { isCorret } = require("../helpers/validate");

router.post("/", (req, res) => {
  let bodylen;
  if (req.body?.cart?.length >= 1) {
    bodylen = 5;
  } else {
    bodylen = 4;
  }
  if (isCorret(bodylen, req.body)) {
    const id = req.body?.id;
    const first_name = req.body?.first_name;
    const last_name = req.body?.last_name;
    const name = first_name + " " + last_name;
    const email_address = req.body?.email_address;
    const cart = req.body?.cart || false;
    if (!isName(name)) {
      res.status(500).json({
        message: "Name is wrong. Make sure to enter first and last name only",
      });
      return;
    } else if (!isEmail(email_address)) {
      res.status(500).json({ message: "Email is not valid" });
      return error;
    }
    const ret = insertOrder(id, name, email_address, cart);
    ret.changes > 0
      ? res.status(201).json({ message: "Invoice created" })
      : res
          .status(500)
          .json({ message: "User does not have a cart to complete the order" });
    return;
  } else {
    res.status(500).json({
      message: `Incomplete Body`,
    });
  }
});
router.use(checkAuth);
router.get("/:id", (req, res) => {
  const id = req.params.id;
  const ret = readAction("orders", "user_id = ?", [id]);
  if (ret.length > 0) {
    res.status(200).json(ret);
  } else {
    res.status(404).json({ message: "No order found" });
  }
});

module.exports = router;
