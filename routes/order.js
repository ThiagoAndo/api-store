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
  if (req.body?.cart) {
    bodylen = 4;
  } else {
    bodylen = 3;
  }

  if (isCorret(bodylen, req.body)) {
    const id = req.body.id;
    const name = req.body.name;
    const email = req.body.email;
    const cart = req.body?.cart || false;
    if (!isName(name)) {
      res.status(500).json({
        message: "Name is wrong. Make sure to enter first and last name only",
      });
      return;
    } else if (!isEmail(email)) {
      res.status(500).json({ message: "Email is not valid" });
      return error;
    }
    const ret = insertOrder(id, name, email, cart);
    ret.changes > 0
      ? res.status(201).json({ message: "Invoice created" })
      : res.status(500).json({ message: "An error has occurred" });
  }
});
router.use(checkAuth);
router.get("/:id", (req, res) => {
  const id = req.params.id;
  const ret = readAction("orders", "user_id = ?", [id]);
  res.status(200).json(ret);
});

module.exports = router;
