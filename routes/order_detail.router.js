var express = require("express");
var router = express.Router();

const { getAll } = require("../controllers/order_detail.controller");

const { Auth } = require("../middlewares");
const { Admin } = Auth;

router.get("/", Admin, getAll);

module.exports = router;
