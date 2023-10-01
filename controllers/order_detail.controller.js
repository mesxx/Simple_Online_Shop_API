const { OrderDetail, Order, Product } = require("../models");

class UserController {
  static getAll = async (_, res, next) => {
    try {
      const data = await OrderDetail.findAll({
        include: [
          {
            model: Order,
            as: "order",
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
          {
            model: Product,
            as: "product_detail",
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
}

module.exports = UserController;
