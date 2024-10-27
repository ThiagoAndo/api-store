const sql = require("better-sqlite3");
const db = sql("e-comerce.db");
const { products } = require("../data/productsData");
function insertProduct(products) {
  const stmt = db.prepare(`
      INSERT INTO products VALUES (
         @id,
         @title,
         @description,
         @price,
         @discountPercentage,
         @rating,
         @stock,
         @brand,
         @category,
         @thumbnail
      )
   `);
  const stmt2 = db.prepare(`
      INSERT INTO images VALUES (
         @itemId,
         @image
      )
   `);

  for (const product of products) {
    if (product.images.length > 1) {
      const thisPro = {
        id: String(product?.id),
        title: product?.title,
        description: product?.description,
        price: product?.price,
        discountPercentage: product?.discountPercentage,
        rating: product?.rating,
        stock: product?.stock || 45,
        brand: product?.brand || "Store Excusive",
        category: product?.category,
        thumbnail: product?.thumbnail,
      };
      stmt.run(thisPro);
      for (const img in product.images) {
        stmt2.run({
          itemId: String(product?.id),
          image: Object.values(product.images)[img],
        });
      }
    }
  }
}

// function deleteData(table) {
//   db.prepare(`DELETE  FROM ${table}`).run();
// }
// function restoreProductTable() {
//   setTimeout(() => {
//     deleteData("images");
//     deleteData("products");
//     insertProduct(products);
//   }, 60 * 60 * 1000);
// }
exports.insertP = insertProduct;
// exports.restore = restoreProductTable;
