const express = require("express");
const router = express.Router();
const pkg = require("bcryptjs");
const { hash } = pkg;
const { newUser, getUser } = require("../actions/userActions");
const { deleteAction, updateAction, readAction } = require("../CRUD/actions");
const { checkAuth } = require("../util/auth");
const { isCorret } = require("../helpers/validate");
const { isDataOk } = require("../actions/userActions");
// require("../helpers/routeLock");

router.get("/admin", async (req, res) => {
  const resp = readAction("users", "email_address!=?", ["admin"]);
  res.status(200).json(resp);
  return;
});

router.post("/get", async (req, res) => {
  if (isCorret(2, req.body)) {
    const user = await getUser({
      email: req.body.email,
      password: req.body.password,
    });

    res.status(200).json(user);
    return;
  } else {
    console.log("chamo");
    res.status(500).json({
      message: `Incomplete Body`,
    });
  }
});

router.post("/new", async (req, res) => {
  if (isCorret(4, req.body)) {
    const data = req.body;
    const ret = await newUser(data);
    res.status(201).json(ret);
    return;
  } else {
    res.status(500).json({
      message: `Incomplete Body`,
    });
  }
});
router.use(checkAuth);
router.patch("/", async (req, res) => {
  const user = req.body;
  let ret = null;
  if (isCorret(4, req.body)) {
    const [userRet] = readAction("users", "email_address=?", [
      user.email_address,
    ]);

    if (
      userRet != undefined &&
      userRet?.email_address === user.email_address &&
      userRet?.id != user.id
    ) {
      res.status(400).json({
        error: `This email has been used by an other user or user id is incorrect.`,
      });
      return;
    } else if (userRet === undefined) {
      const isOk = isDataOk(user);
      if (isOk) {
        res.status(404).json({
          message: isOk.message,
        });
        return;
      }
      HTTPresponse();
    } else if (
      userRet != undefined &&
      userRet?.email_address === user.email_address &&
      userRet?.id === user.id
    ) {
      const isOk = isDataOk(user);
      if (isOk) {
        res.status(404).json({
          ...isOk,
        });
        return;
      }
      HTTPresponse();
    }

    function HTTPresponse() {
      ret = updateAction(
        "users",
        "email_address=?, first_name = ?, last_name = ?",
        "id = ?",
        [user.email_address, user.first_name, user.last_name, user.id]
      );
      ret.changes > 0
        ? res
            .status(200)
            .json({ message: `Updated user\`s detail with id ${user.id}` })
        : res.status(200).json({
            message: `Could not update user\`s detail with id ${user.id}`,
          });
      return;
    }
  } else {
    res.status(500).json({
      message: `Incomplete Body`,
    });
    return;
  }
});

router.patch("/password", async (req, res) => {
  const user = req.body;
  let ret = null;
  if (isCorret(2, req.body)) {
    console.log("patch");
    user.password = await hash(user.password, 12);
    ret = updateAction("users", "password = ?", "id = ?", [
      user.password,
      user.id,
    ]);
    ret.changes > 0
      ? res.status(200).json({
          message: `Updated user\`s password detail with id ${user.id}`,
        })
      : res.status(404).json({
          message: `Could not update user\`s password with id ${user.id}`,
        });
  } else {
    res.status(500).json({
      message: `Incomplete Body`,
    });
    return;
  }
});

router.delete("/", async (req, res) => {
  if (isCorret(1, req.body)) {
    const user = req.body;
    deleteAction("orders", "user_id = ?", [user.id]);
    deleteAction("cart", "user_id = ?", [user.id]);
    deleteAction("userAddress", "id = ?", [user.id]);
    const ret = deleteAction("users", "id = ?", [user.id]);
    ret.changes > 0
      ? res.status(200).json({ message: `Deleted user with id ${user.id}` })
      : res
          .status(404)
          .json({ message: `Could not delete user with id ${user.id}` });
    return;
  } else {
    res.status(500).json({
      message: `Incomplete Body`,
    });
  }
});

// router.delete("/all", async (req, res) => {
//   const user = req.body;
//   deleteAction("orders", "user_id != ?", [user.id]);
//   deleteAction("cart", "user_id  != ?", [user.id]);
//   deleteAction("userAddress", "id != ?", [user.id]);
//   const ret = deleteAction("users", "id != ?", [user.id]);
//   ret.changes > 0
//     ? res.status(200).json({ message: `Deleted user with id ${user.id}` })
//     : res
//         .status(200)
//         .json({ message: `Could not delete user with id ${user.id}` });
// });
module.exports = router;
