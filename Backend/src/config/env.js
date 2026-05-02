const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

const projectEnvPath = path.join(__dirname, "../../project.env");
const dotEnvPath = path.join(__dirname, "../../.env");

if (fs.existsSync(projectEnvPath)) {
  dotenv.config({ path: projectEnvPath });
} else {
  dotenv.config({ path: dotEnvPath });
}

module.exports = {
  port: process.env.PORT || 5000,
  mongoUri:
    process.env.MONGODB_URI || "mongodb://localhost:27017/hospital_management",
  jwtSecret: process.env.JWT_SECRET || "your_super_secret_jwt_key",
  nodeEnv: process.env.NODE_ENV || "development",
  corsOrigin: process.env.CORS_ORIGIN || "*",
};
