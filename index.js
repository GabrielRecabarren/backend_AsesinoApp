// Importar módulos necesarios
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import router from './src/routes/routes.js';

// Crear instancias
const app = express();
const httpServer = http.createServer(app);

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
const io = new Server(httpServer);



const prisma = new PrismaClient();

// Manejar eventos de Socket.io

io.on('connect', (socket) => {
  console.log('Usuario conectado:', socket.id);

  // Manejar el evento de chat message
  socket.on('chat message', (msg) => {
    // Transmitir el mensaje a todos los clientes
    io.emit('chat message', msg);
  });
  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
  });
});


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
