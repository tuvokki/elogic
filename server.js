const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);
let numberOfClientsConnected = 0;

var MongoStream = require('mongo-trigger');

var watcher = new MongoStream({
  format: 'pretty',
  connectionString: process.env.MONGOLAB_URI
});

// watch the collection
watcher.watch(process.env.DB_NAME + '.lalala', function (event) {
  // parse the results
  console.log('something changed:', event);
  io.emit('user', event.data);
});

io.on('connection', (socket) => {
  numberOfClientsConnected += 1;
  socket.emit('message', `Welcome! id: ${socket.id} you are client #${numberOfClientsConnected}.`);
  console.log(`Client #${numberOfClientsConnected} connected`, socket.id);
  socket.on('disconnect', () => {
    numberOfClientsConnected -= 1;
    console.log('Client disconnected');
  });
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
