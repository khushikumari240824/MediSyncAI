const mongoose = require("mongoose");

const connectDatabase = async () => {
  const env = require("./env");
  await mongoose.connect(env.mongoUri);
  console.log("MongoDB Connected");
};

module.exports = { connectDatabase };
