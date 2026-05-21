const { Server } = require('socket.io');

let ioInstance = null;

function initSocket(server) {
  if (ioInstance) return ioInstance;

  ioInstance = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  ioInstance.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('join', (room) => {
      if (room) socket.join(room);
    });

    socket.on('leave', (room) => {
      if (room) socket.leave(room);
    });

    socket.on('disconnect', (reason) => {
      console.log(`Socket ${socket.id} disconnected:`, reason);
    });
  });

  return ioInstance;
}

function getIO() {
  if (!ioInstance) throw new Error('Socket.io not initialized');
  return ioInstance;
}

module.exports = { initSocket, getIO };
