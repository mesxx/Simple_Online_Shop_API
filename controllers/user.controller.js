const bcrypt = require("bcrypt");
const Joi = require("joi");

const { User, Order } = require("../models");
const { jwt } = require("../helpers");

class UserController {
  static register = async (req, res, next) => {
    const schema = Joi.object({
      username: Joi.string().min(2).required(),
      password: Joi.string().min(4).required(),
    });
    const { error } = schema.validate(req.body);
    if (error) throw { message: error.message };
    const { username, password } = req.body;
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const data = await User.create({
        username,
        password: hashedPassword,
      });

      res.status(201).json({
        code: 201,
        message: "success",
        data: { ...data.dataValues },
      });
    } catch (error) {
      next(error);
    }
  };

  static access = async (req, res, next) => {
    const schema = Joi.object({
      username: Joi.string().min(2).required(),
      password: Joi.string().min(4).required(),
    });
    const { error } = schema.validate(req.body);
    const { username, password } = req.body;
    try {
      if (error) throw { message: error.message };
      const userExist = await User.findOne({ where: { username } });
      if (!userExist) throw { message: "validation failed" };

      const isValid = await bcrypt.compare(password, userExist.password);
      if (!isValid) throw { message: "validation failed" };
      const token = jwt.sign({ id: userExist.id });

      res.status(200).json({
        code: 200,
        message: "success",
        data: { name: userExist.name, email: userExist.email, token },
      });
    } catch (error) {
      next(error);
    }
  };

  static getAll = async (_, res, next) => {
    try {
      const data = await User.findAll({
        include: [
          {
            model: Order,
            as: "orders",
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
        attributes: { exclude: ["password", "createdAt", "updatedAt"] },
      });

      res.status(200).json({
        code: 200,
        message: "success",
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  static getUser = async (req, res, next) => {
    const { id } = req.user;
    try {
      const data = await User.findOne({
        where: { id },
        include: [{ model: Order, as: "orders" }],
        attributes: { exclude: ["password", "createdAt", "updatedAt"] },
      });

      res.status(200).json({
        code: 200,
        message: "success",
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  static addBalance = async (req, res, next) => {
    const { id } = req.user;
    const { balance } = req.body;
    try {
      await User.update({ balance }, { where: { id } });
      const data = await User.findOne({
        where: { id },
        attributes: { exclude: ["password", "createdAt", "updatedAt"] },
      });

      res.status(200).json({
        code: 200,
        message: "success",
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  static changeRole = async (req, res, next) => {
    const { id } = req.user;
    try {
      await User.update({ role: "admin" }, { where: { id } });
      const data = await User.findOne({
        where: { id },
        attributes: { exclude: ["password", "createdAt", "updatedAt"] },
      });

      res.status(200).json({
        code: 200,
        message: "success",
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = UserController;
