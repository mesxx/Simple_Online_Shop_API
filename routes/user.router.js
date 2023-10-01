var express = require("express");
var router = express.Router();

const {
  register,
  access,
  getAll,
  getUser,
  addBalance,
  changeRole,
} = require("../controllers/user.controller");

const { Auth } = require("../middlewares");
const { Registered, Admin } = Auth;

router.post("/register", register);
router.post("/access", access);

router.get("/", Admin, getAll);

router.get("/detail", Registered, getUser);
router.patch("/balance", Registered, addBalance);
router.patch("/role-admin", Registered, changeRole);

module.exports = router;
