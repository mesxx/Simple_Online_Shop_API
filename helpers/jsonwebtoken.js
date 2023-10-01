const jwt = require("jsonwebtoken");

class Jwt {
  static sign = (payload) => {
    const secret = process.env.JWT_SECRET;
    return jwt.sign(payload, secret);
  };

  static decode = (token) => {
    const secret = process.env.JWT_SECRET;
    return jwt.verify(token, secret);
  };
}

module.exports = Jwt;
