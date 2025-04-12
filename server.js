const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let users = [];

io.on("connection", (socket) => {
  console.log("Novo usuário conectado:", socket.id);

  socket.on("join", (username) => {
    users.push({ id: socket.id, name: username });
    io.emit("user list", users.map((u) => u.name));
  });

  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    users = users.filter((u) => u.id !== socket.id);
    io.emit("user list", users.map((u) => u.name));
    console.log("Usuário desconectado:", socket.id);
  });
});

server.listen(3001, () => {
  console.log("Servidor rodando em http://localhost:3001");
});