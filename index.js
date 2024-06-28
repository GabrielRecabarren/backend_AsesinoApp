// Importar módulos necesarios
import express from 'express';
import { createServer } from 'http';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import router from './src/routes/routes.js';
import initializeSocket from './socket.js';
import { vaciarTodasLasTablas } from './src/controllers/borrarTodo.js';

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

const port = process.env.PORT || 3000;
// Iniciar servidor HTTP
httpServer.listen(port,"0.0.0.0",() => {
  console.log(`Servidor HTTP en puerto ${port}`, 'Hola');
});

// Inicializar Socket.IO
const io = initializeSocket(httpServer);

const prisma = new PrismaClient();
// Llamar a la función para vaciar todas las tablas

// Función principal
async function main() {
  try {
    // Tu lógica principal aquí
    // vaciarTodasLasTablas();
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
