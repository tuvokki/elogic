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

var watcher = new MongoStream({ format: 'pretty' });

// watch the collection
watcher.watch('test.users', function (event) {
  // parse the results
  console.log('something changed:', event);
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

const messages = [
  'hello world', 'banana', 'freaks everywhere', 'hmmm ... icecream', 'why not?', 'smile, please, smile',
];

function sendMessage() {
  if (numberOfClientsConnected > 0) {
    const returnMsg = messages[Math.floor(Math.random() * messages.length)];
    console.log(`Sending message "${returnMsg}" to clients.`);
    io.emit('message', returnMsg);
  }
}

setInterval(() => sendMessage(), 5000);
