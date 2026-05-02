const app = require("./app");
const { connectDatabase } = require("./config/db");
const env = require("./config/env");

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

startServer();
