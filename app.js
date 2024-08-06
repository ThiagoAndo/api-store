const express = require("express");
const bodyParser = require("body-parser");
const products = require("./routes/product");
const user = require("./routes/user");
const cart = require("./routes/cart");
const add = require("./routes/address");
const order = require("./routes/order");
const doc = require("./routes/docs");
const app = express();

app.use(express.static(__dirname + "/public"));
app.set("view engine", "html");
app.set("views", __dirname + "/views");
app.engine("html", require("ejs").renderFile);
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

app.use("/doc", doc);
app.use("/products", products);
app.use("/user", user);
app.use("/cart", cart);
app.use("/add", add);
app.use("/order", order);

app.get("/download", function (req, res) {
  const file = `${__dirname}/postman/REST-API-postman.json`;
  res.download(file); // Set disposition and send it.
});

app.get("/doc", (req, res) => {
  res.render("index.html");
});

app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || "Something went wrong.";
  res.status(status).json({ message: message });
});

app.listen(8080, () => {
  console.log("Server runnig on port 8080");
});
