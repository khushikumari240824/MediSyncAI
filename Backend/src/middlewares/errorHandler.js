const { nodeEnv } = require("../config/env");

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message || "Internal server error",
    ...(nodeEnv === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
