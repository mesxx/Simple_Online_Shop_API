var express = require("express");
var router = express.Router();

const {
  create,
  getAll,
  destroy,
} = require("../controllers/product.controller");

const { Auth } = require("../middlewares");
const { Admin } = Auth;

router.post("/", Admin, create);
router.get("/", Admin, getAll);
router.delete("/:id", Admin, destroy);

module.exports = router;
