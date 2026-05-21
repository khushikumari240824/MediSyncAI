const cors = require("cors");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const env = require("../config/env");

const corsMiddleware = cors({
  origin: env.corsOrigin === "*" ? true : env.corsOrigin,
  credentials: true,
});

const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests. Please try again later.",
  },
});

const noSqlInjectionProtection = mongoSanitize({
  replaceWith: "_",
});

module.exports = {
  corsMiddleware,
  apiRateLimiter,
  noSqlInjectionProtection,
};
