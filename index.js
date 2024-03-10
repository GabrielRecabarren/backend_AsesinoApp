// Importar módulos necesarios
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import router from './src/routes/routes.js';

// Crear instancias
const app = express();
const httpServer = createServer(app);

// Configurar middleware y rutas
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
}));
app.use((req, res, next) => {
  console.log(`Solicitud recibida: ${req.method} ${req.url}`);
  next();
});
app.use(router);

const port = 3000;
// Iniciar servidor HTTP
httpServer.listen(port, () => {
  console.log(`Servidor HTTP y Socket.io en puerto ${port}`);
});
// Iniciar servidor Socket.io en el mismo servidor HTTP
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Manejar eventos de Socket.io
io.on('connection', socket => {
  console.log(`[${socket.id}] socket connected`);
  io.emit('connection'); // Emite a todos los clientes

  console.log(socket.id);
  console.log('Usuario conectado:', socket.id);

  /// Manejar el evento de chat message
  socket.on('chat-message', (msg, callback) => {
    // Emitir el mensaje a todos los clientes, incluido el cliente que lo envió
    console.log(msg,"*--msg");
    io.emit('chat-message', msg);
  
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

const prisma = new PrismaClient();

// Función principal
async function main() {
  try {
    // Tu lógica principal aquí
    console.log('Prisma: funcionando.');
  } catch (error) {
    console.error('Error en la ejecución principal:', error);
  } finally {
    // Desconectar Prisma al finalizar
    await prisma.$disconnect();
  }
}

// Ejecutar función principal
main();
