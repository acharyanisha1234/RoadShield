/**
 * Socket.IO handler
 * Manages real-time connections, rooms, and events
 */

const User = require('../models/User');

// Track online users
const onlineUsers = new Map();

/**
 * Initialize Socket.IO with the HTTP server
 */
const initializeSocket = (io) => {
  /**
   * Authentication middleware
   * Verifies JWT token before allowing connection
   */
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error('Authentication required'));
      }

      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  /**
   * Connection handler
   */
  io.on('connection', (socket) => {
    const userId = socket.userId;

    console.log(`[Socket] User connected: ${socket.user.name} (${userId})`);

    // Track online user
    onlineUsers.set(userId, {
      id: userId,
      name: socket.user.name,
      socketId: socket.id,
      connectedAt: new Date(),
    });

    // Join personal room
    socket.join(`user:${userId}`);

    // Broadcast online count
    io.emit('users:online', {
      count: onlineUsers.size,
      users: Array.from(onlineUsers.values()).map((u) => ({
        id: u.id,
        name: u.name,
      })),
    });

    // -------- LOCATION TRACKING --------
    socket.on('location:update', ({ latitude, longitude }) => {
      const user = onlineUsers.get(userId);
      if (user) {
        user.location = { latitude, longitude };
        user.updatedAt = new Date();
      }
    });

    // -------- REPORT SUBSCRIPTION --------
    socket.on('reports:subscribe', () => {
      socket.join('reports');
      console.log(`[Socket] ${socket.user.name} subscribed to reports`);
    });

    socket.on('reports:unsubscribe', () => {
      socket.leave('reports');
    });

    // -------- SOS --------
    socket.on('sos:trigger', (data) => {
      console.log(`[Socket] SOS from ${socket.user.name}:`, data);

      // Broadcast SOS to all connected users
      socket.broadcast.emit('sos:alert', {
        userId,
        userName: socket.user.name,
        latitude: data.latitude,
        longitude: data.longitude,
        timestamp: new Date(),
      });
    });

    // -------- DISCONNECT --------
    socket.on('disconnect', () => {
      console.log(`[Socket] User disconnected: ${socket.user.name}`);

      onlineUsers.delete(userId);

      io.emit('users:online', {
        count: onlineUsers.size,
        users: Array.from(onlineUsers.values()).map((u) => ({
          id: u.id,
          name: u.name,
        })),
      });
    });
  });

  return io;
};

/**
 * Emit new report to all subscribed clients
 * Called from report controller
 */
const emitNewReport = (io, report) => {
  io.to('reports').emit('report:new', {
    report,
    timestamp: new Date(),
  });
};

/**
 * Emit report update
 */
const emitReportUpdate = (io, report) => {
  io.to('reports').emit('report:update', {
    report,
    timestamp: new Date(),
  });
};

/**
 * Get online users count
 */
const getOnlineCount = () => onlineUsers.size;

module.exports = {
  initializeSocket,
  emitNewReport,
  emitReportUpdate,
  getOnlineCount,
};