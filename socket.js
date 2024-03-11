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
    console.log(`[${socket.id}] socket connected en puerto 3000`);

    // Emite un evento de conexión a todos los clientes
    io.emit('connection'); 

    console.log('Usuario conectado:', socket.id);

   // Manejar el evento de chat message
socket.on('chat-message',  (msg,callback) => {
console.log (`Llega el mensaje : ${msg}`);
  // Aquí se debería procesar el mensaje, por ejemplo, guardarlo en una base de datos
  // y luego emitirlo a todos los clientes
  
  callback({ success: true, message: "Mensaje recibido correctamente a todos los usuarios desde el backend" });
  io.emit('chat-message', msg, () => {
    console.log("Se emite el mensaje recibido desde el backend:",msg)
    // Enviar una respuesta al callback del cliente
    
  });
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
