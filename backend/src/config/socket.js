const { Server } = require("socket.io");
const http = require("http");

const express = require("express");
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: ["http://localhost:5173"],
});

const getRecieverSocketId = (userId) => {
  return userSocketMap[userId];
};

const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("A user connected " + socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected " + socket.id);

    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

module.exports = { io, server, app, getRecieverSocketId };
