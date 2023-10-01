var express = require("express");
var router = express.Router();

const user = require("./user.router");
const order = require("./order.router");
const order_detail = require("./order_detail.router");
const product = require("./product.router");

router.use("/users", user);
router.use("/orders", order);
router.use("/order-details", order_detail);
router.use("/products", product);

module.exports = router;
