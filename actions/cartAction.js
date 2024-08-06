const { readAction, deleteAction } = require("../CRUD/actions");
function isProduct(id) {
  const product = readAction("products", "id=?", [id]);
  const ret = product.length > 0;
  return ret;
}
function rearranging(body) {
  const { item, id: user_id } = body;
  let { id: item_id, name, price, quantity: qnt, createAt: creation_at } = item;
  if (user_id && item_id && qnt && price && name && creation_at) {
    return {
      user_id,
      item_id,
      qnt,
      bought: 0,
      price,
      name,
      creation_at,
    };
  } else {
    return false;
  }
}
function deleleteCart(option, cart) {
  let ret;
  switch (option) {
    case 0:
      ret = deleteAction("cart", "user_id=? AND bought=?", [cart, 0]);
      break;
    case 1:
      ret = deleteAction("cart", "item_id = ? AND user_id=?", [
        cart.item_id,
        cart.user_id,
      ]);
      break;
    default:
      console.log("Something went wrong on switch delete cart");
  }
  return ret;
}
exports.isProduct = isProduct;
exports.rearranging = rearranging;
exports.deleleteCart = deleleteCart;
