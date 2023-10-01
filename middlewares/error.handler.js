const errorHandler = (err, req, res, next) => {
  let code = 500;
  let error = "[Internal server error] initial server error";

  if (err.message === "not found") {
    code = 404;
    error = `[Not found] ${err.message}`;
  } else if (
    err.message.includes("is required") ||
    err.message.includes("validation failed") ||
    err.message.includes("must be a valid")
  ) {
    code = 400;
    error = `[Bad Request] ${err.message}`;
  } else if (
    err.message === "no access" ||
    err.message.includes("jwt malformed") ||
    err.message.includes("invalid signature")
  ) {
    code = 401;
    error = `[Not Authorized] ${err.message}`;
  } else if (err.message.includes("must be admin")) {
    code = 403;
    error = `[Forbidden] ${err.message}`;
  } else if (err.message.includes("Validation error")) {
    code = 409;
    error = `[Conflict] Duplicate data. ${err.message}`;
  }

  res.status(code).json({
    code,
    message: error,
  });
};

module.exports = errorHandler;
