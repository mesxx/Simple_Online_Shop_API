const Joi = require("joi");

const { Order, OrderDetail, User, Product } = require("../models");

class UserController {
  static create = async (req, res, next) => {
    const schema = Joi.object({
      orders: Joi.array().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) throw { message: error.message };
    const { orders } = req.body;
    const { id, balance } = req.user;
    try {
      let detailPrice = 0;
      let orderPrice = 0;
      for (const el of orders) {
        const product = await Product.findOne({ where: { id: el.product_id } });

        if (product.qty < el.qty) {
          throw {
            message: `validation failed. ${product.name} insufficient stock`,
          };
        }

        detailPrice = product.price * el.qty;
        orderPrice += detailPrice;
      }

      if (balance - orderPrice < 0) {
        throw { message: "validation failed. low balance" };
      }

      const orderData = await Order.create({
        user_id: id,
        total_price: orderPrice,
      });
      const orderId = orderData.id;

      for (const el of orders) {
        const product = await Product.findOne({ where: { id: el.product_id } });

        await Product.update(
          { qty: product.qty - el.qty },
          { where: { id: product.id } }
        );

        await OrderDetail.create({
          order_id: orderId,
          product_id: product.id,
          qty: el.qty,
          total_price: product.price * el.qty,
        });
      }

      await User.update({ balance: balance - orderPrice }, { where: { id } });

      res.status(201).json({
        code: 201,
        message: "success",
      });
    } catch (error) {
      next(error);
    }
  };

  static getAll = async (_, res, next) => {
    try {
      const data = await Order.findAll({
        include: [
          {
            model: OrderDetail,
            as: "order_detail",
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
          {
            model: User,
            as: "user",
            attributes: { exclude: ["password", "createdAt", "updatedAt"] },
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

  static getOrder = async (req, res, next) => {
    const { id } = req.params;
    try {
      const data = await Order.findOne({
        where: { id },
        include: [
          {
            model: OrderDetail,
            as: "order_detail",
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
          {
            model: User,
            as: "user",
            attributes: { exclude: ["password", "createdAt", "updatedAt"] },
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
}

module.exports = UserController;
