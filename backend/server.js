require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');

const app = require('./src/app');
const connectDB = require('./src/config/db');
const { initializeSocket } = require('./src/sockets/socketHandler');

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  // Create HTTP server
  const server = http.createServer(app);

  // Initialize Socket.IO
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PATCH'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Attach to app so controllers can access io
  app.set('io', io);

  // Initialize socket handlers
  initializeSocket(io);

  server.listen(PORT, '0.0.0.0', () => {
    console.log(` Server running on port ${PORT}`);
    console.log(`Local:   http://localhost:${PORT}`);
    console.log(`Network: http://192.168.1.64:${PORT}`);
    console.log(`Socket.IO ready`);
  });
});