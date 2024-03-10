// socket.js

import { Server } from 'socket.io';

export default function initializeSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Manejar eventos de Socket.io
  io.on('connection', socket => {
    console.log(`[${socket.id}] socket connected`);

    // Emite un evento de conexión a todos los clientes
    io.emit('connection'); 

    console.log('Usuario conectado:', socket.id);

    // Manejar el evento de chat message
    socket.on('chat-message', (msg, callback) => {
      // Emitir el mensaje a todos los clientes, incluido el cliente que lo envió
      socket.broadcast.emit('chat-message', msg);
    
      // Enviar una respuesta al callback del cliente
      callback({ success: true, message: "Mensaje recibido correctamente" });
    });
    
    socket.on('disconnect', reason => {
      console.log(`[${socket.id}] socket disconnected - ${reason}`);
    });
  });

  // Manejar eventos de Socket.io fuera del alcance del 'connection'
  setInterval(() => {
    io.emit('time-msg', { time: new Date().toISOString() });
  }, 1000);

  return io;
}
