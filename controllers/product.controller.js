const Joi = require("joi");

const { Product, OrderDetail } = require("../models");

class UserController {
  static create = async (req, res, next) => {
    const schema = Joi.object({
      name: Joi.string().required(),
      price: Joi.number().integer().required(),
      qty: Joi.number().integer().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) throw { message: error.message };
    const { name, price, qty } = req.body;
    try {
      const data = await Product.create({ name, price, qty });

      res.status(201).json({
        code: 201,
        message: "success",
        data: { ...data.dataValues },
      });
    } catch (error) {
      next(error);
    }
  };

  static getAll = async (_, res, next) => {
    try {
      const data = await Product.findAll({
        include: [
          {
            model: OrderDetail,
            as: "ordered",
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
        attributes: { exclude: ["createdAt", "updatedAt"] },
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

  static destroy = async (req, res, next) => {
    const { id } = req.params;
    try {
      await Product.destroy({ where: { id } });

      res.status(200).json({
        code: 200,
        message: "success",
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = UserController;
