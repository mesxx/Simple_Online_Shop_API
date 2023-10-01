var express = require("express");
var router = express.Router();

const { create, getAll, getOrder } = require("../controllers/order.controller");

const { Auth } = require("../middlewares");
const { Registered, Admin } = Auth;

router.post("/", Registered, create);

router.get("/", Admin, getAll);
router.get("/:id", Admin, getOrder);

module.exports = router;
