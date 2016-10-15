const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

io.on('connection', (socket) => {
  socket.emit('message', `Welcome! id: ${socket.id}`);
  console.log('Client connected', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected'));
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);

const messages = [
  'hello world', 'banana', 'freaks everywhere', 'hmmm ... icecream', 'why not?',
];

function sendMessage() {
  const returnMsg = messages[Math.floor(Math.random() * messages.length)];
  console.log(`Sending message "${returnMsg}" to clients.`);
  return returnMsg;
}

setInterval(() => io.emit('message', sendMessage()), 5000);
