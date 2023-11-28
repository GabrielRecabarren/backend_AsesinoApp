import express from "express";
import { PrismaClient } from "@prisma/client";
import router from "./src/routes/routes.js";

//Creamos la instancia de express
const app = express();
const port = 3000;
//Cliente de Prisma
const prisma = new PrismaClient();

// Middleware para procesar solicitudes con formato JSON
app.use(express.json());

// Middleware para manejar errores
app.use((err, req, res, next) => {
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
  app.get('/users')
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
