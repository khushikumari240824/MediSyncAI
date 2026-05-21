const app = require('./app');
const { connectDatabase } = require('./config/db');
const env = require('./config/env');
const http = require('http');
const { initSocket } = require('./services/socket.service');

const startServer = async () => {
  try {
    await connectDatabase();

    const server = http.createServer(app);

    // initialize Socket.io and attach to the server
    initSocket(server);

    server.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

startServer();
