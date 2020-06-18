const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const { Socket } = require("dgram");

const {
  generateMessage,
  generateLocationMessage,
  generateBuzzMessage,
} = require("./utils/message");
const { isRealString } = require("./utils/isRealString");
const { Users } = require("./utils/user");

const publicPath = path.join(__dirname, "/../public");
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);
let users = new Users();

app.use(express.static(publicPath));

io.on("connection", (socket) => {
  console.log("A new user just connected");

  socket.on("join", (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback("Name and room are required");
    }
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit("updateUsersList", users.getUserList(params.room));

    socket.emit(
      "newMessage",
      generateMessage("Admin", `Welcome to ${params.room} !`)
    );
    socket.broadcast
      .to(params.room)
      .emit("newMessage", generateMessage("Admin", "A new user joined"));
    callback();
  });

  socket.on("createMessage", (message, callback) => {
    let user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
      io.to(user.room).emit(
        "newMessage",
        generateMessage(user.name, message.text)
      );
    }
    // console.log("createMessage", message);

    callback("This is the server:");
  });

  socket.on("createLocationMessage", (coords) => {
    let user = users.getUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "newLocationMessage",
        generateLocationMessage(user.name, coords.lat, coords.lon)
      );
    }
  });

  socket.on("createBuzzMessage", (message) => {
    console.log(message);

    let user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
      io.to(user.room).emit(
        "newBuzzMessage",
        generateBuzzMessage(user.name, message.text)
      );
    }
  });

  socket.on("disconnect", () => {
    let user = users.removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("updateUsersList", users.getUserList(user.room));
      io.to(user.room).emit(
        "newMessage",
        generateMessage("Admin", `${user.name} has left from ${user.room} room`)
      );
    }
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
