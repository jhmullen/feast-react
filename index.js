const express = require('express');
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
io.on('connection', socket => {
  console.log('conn');
  socket.on('action', action => console.log('action', action));
});

app.use('/', express.static('build'));
app.use('/static', express.static('build/static'));
app.use('/build', express.static('build'));

server.listen(3000);
