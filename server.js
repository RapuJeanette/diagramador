const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const cors = require('cors'); 

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());

app.get('/', (req, res) => {
  res.send('¡Hola Mundo!');
});

const port = 3000;
server.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});

io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado');

  socket.on('disconnect', () => {
    console.log('Un cliente se ha desconectado');
  });

  socket.on('mensaje', (mensaje) => {
    console.log(`Recibido: ${mensaje}`);
    io.emit('mensaje', mensaje);
  });
});


