const jwt = require("jsonwebtoken");
let users = {}; // { userId: socketId }

const authSocket = (socket, next) => {
  let token = socket.handshake.auth.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.TOKEN_KEY);
      socket.decoded = decoded;
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  } else {
    next(new Error("Authentication error"));
  }
};

const socketServer = (socket) => {
  const userId = socket.decoded.userId;
  users[userId] = socket.id;

  socket.on("send-message", (recipientUserId, username, content) => {
    const recipientSocketId = users[recipientUserId];
    if (recipientSocketId) {
      socket
        .to(recipientSocketId)
        .emit("receive-message", userId, username, content);
    }
  });

  socket.on("disconnect", () => {
    delete users[userId];
  });
};

// Function to emit notification to a specific user
const emitNotification = (recipientId, notification) => {
  const recipientSocketId = users[recipientId];
  if (recipientSocketId) {
    const io = require('socket.io');
    const server = require('./server');
    const socket = server.io.sockets.sockets.get(recipientSocketId);
    if (socket) {
      socket.emit('new_notification', notification);
    }
  }
};

// Function to emit unread count update to a specific user
const emitUnreadCount = (recipientId, count) => {
  const recipientSocketId = users[recipientId];
  if (recipientSocketId) {
    const io = require('socket.io');
    const server = require('./server');
    const socket = server.io.sockets.sockets.get(recipientSocketId);
    if (socket) {
      socket.emit('unread_count_update', { count });
    }
  }
};

module.exports = { socketServer, authSocket, emitNotification, emitUnreadCount };
