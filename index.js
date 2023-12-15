import express from "express";
import { PrismaClient } from "@prisma/client";
import router from "./src/routes/routes.js";
import cors from "cors";

//Creamos la instancia de express
const app = express();
const port = 3000;
//Cliente de Prisma
const prisma = new PrismaClient();

// Middleware para procesar solicitudes con formato JSON
app.use(express.json());

app.use((req, res, next) => {
  console.log(`Solicitud recibida: ${req.method} ${req.url}`);
  next();
});

app.use(
  cors({
    origin: "http://192.168.1.87:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

// Middleware para manejar errores
app.use(async (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Error interno del servidor" });
});

//Routes
app.use(router);

//Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor en puerto ${port}`);
});

async function main() {
  
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
