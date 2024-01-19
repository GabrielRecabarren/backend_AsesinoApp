import { Router } from "express";
import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
} from "../controllers/userController.js";

import {
  agregarJugadores,
  crearPartida,
  finalizarPartida,
  listarPartidas,
  listarPartidasPorId,
} from "../controllers/gameController.js";

import {
  obtenerTodosLosMensajes,
  crearMensaje,
  eliminarMensajePorId,
} from "../controllers/messageController.js";
import { verificarToken } from "../middleware/authmiddleware.js";

const router = Router();

// Rutas para usuarios
router.get("/users", verificarToken, getAllUsers);
router.get("/users/:id",verificarToken, getUser);
router.post("/createUser", createUser);
router.put("/users/:id",verificarToken, updateUser);
router.delete("/deleteUser/:id",verificarToken, deleteUser);

// Ruta para inicio de sesión
router.post("/login", loginUser);

// Ruta para Crear Partida
router.post("/crearPartida", verificarToken, crearPartida);
router.put("/finalizarPartida/:gameId", finalizarPartida)

//Ruta para listar todas las partidas (admin)
router.get("/games", listarPartidas);

//Ruta para listar todas las partidas de un usuario
router.get("/games/:userId", listarPartidasPorId);



//Agregar jugadores
router.put("/games/:gameId", agregarJugadores);

// Rutas para mensajes
router.get("/messages", obtenerTodosLosMensajes);
router.post("/messages", crearMensaje);
router.delete("/messages/:id", eliminarMensajePorId);

export default router;
