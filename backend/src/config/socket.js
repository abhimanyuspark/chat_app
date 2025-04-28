const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {};

const getRecieverSocketId = (userId) => {
  return userSocketMap[userId];
};

io.on("connection", (socket) => {
  console.log("A user connected " + socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // Emit online users to all clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle new message event
  socket.on("sendMessage", (data) => {
    const { recipientId, message, sender } = data;

    // Get the recipient's socket ID
    const receiverSocketId = getRecieverSocketId(recipientId);

    // If recipient is online, send them the message
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", {
        senderId: userId,
        message: message,
        sender: sender,
        timestamp: new Date().toISOString(),
      });
    }

    // Acknowledge message receipt to sender
    socket.emit("messageSent", {
      recipientId,
      message,
      timestamp: new Date().toISOString(),
    });
  });

  // Handle typing indicator
  socket.on("typing", (data) => {
    const { recipientId } = data;
    const receiverSocketId = getRecieverSocketId(recipientId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("userTyping", {
        senderId: userId,
        isTyping: true,
      });
    }
  });

  // Handle stop typing indicator
  socket.on("stopTyping", (data) => {
    const { recipientId } = data;
    const receiverSocketId = getRecieverSocketId(recipientId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("userTyping", {
        senderId: userId,
        isTyping: false,
      });
    }
  });

  // Handle read receipt
  socket.on("messageRead", (data) => {
    const { senderId, messageId } = data;
    const senderSocketId = getRecieverSocketId(senderId);

    if (senderSocketId) {
      io.to(senderSocketId).emit("messageDelivered", {
        messageId,
        recipientId: userId,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected " + socket.id);

    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

module.exports = { io, server, app, getRecieverSocketId };
