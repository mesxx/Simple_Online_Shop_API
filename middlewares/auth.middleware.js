const { jwt } = require("../helpers");
const { User } = require("../models");

class Auth {
  static Registered = async (req, res, next) => {
    try {
      let token;
      if (!req.headers.authorization) throw { message: "no access" };
      if (req.headers.authorization.split(" ")[0] === "Bearer") {
        const authHeader = req.header("Authorization");
        token = authHeader && authHeader.split(" ")[1];
      }
      if (!token) throw { message: "no access" };

      const verified = jwt.decode(token);
      const userExist = await User.findOne({ where: { id: verified.id } });
      if (!userExist) throw { message: "no access" };

      req.user = userExist;

      next();
    } catch (error) {
      next(error);
    }
  };

  static Admin = async (req, res, next) => {
    try {
      let token;
      if (!req.headers.authorization) throw { message: "no access" };
      if (req.headers.authorization.split(" ")[0] === "Bearer") {
        const authHeader = req.header("Authorization");
        token = authHeader && authHeader.split(" ")[1];
      }
      if (!token) throw { message: "no access" };

      const verified = jwt.decode(token);
      const userExist = await User.findOne({ where: { id: verified.id } });
      if (!userExist || userExist.role !== "admin")
        throw { message: "must be admin" };

      req.user = userExist;

      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = Auth;
