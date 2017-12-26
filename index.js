const express = require("express");
const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

io.on("connection", socket => {
  console.log("connected");
  socket.on("action", action => socket.broadcast.emit("action", action));
});

app.use("/", express.static("build"));
app.use("/static", express.static("build/static"));
app.use("/build", express.static("build"));

const port = process.argv[2] || 3000;

server.listen(port, () => {
  console.log("listening on " + port);
});
