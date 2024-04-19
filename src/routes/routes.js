import { Router } from "express";
import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  changeUserRole,
} from "../controllers/userController.js";

import {
  agregarJugadores,
  crearPartida,
  finalizarPartida,
  listarJugadores,
  listarPartidas,
  listarPartidasPorId,
  cargarPartidaPorId,
  assignUserRoleInGame,
  consultarRolUsuarioEnPartida
} from "../controllers/gameController.js";

import {
  crearMensaje,
  eliminarMensajePorId,
  obtenerMensajesPorPartida,
} from "../controllers/messageController.js";
import { verificarToken } from "../middleware/authmiddleware.js";

const router = Router();

// Rutas para usuarios
router.get("/users", verificarToken, getAllUsers);
router.get("/users/:id",verificarToken, getUser);
router.post("/createUser", createUser);
router.put("/users/:id",verificarToken, updateUser);
router.delete("/deleteUser/:id",verificarToken, deleteUser);

router.get("/players/:gameId", verificarToken, listarJugadores)//Listar jugadores por id de juego

// Ruta para inicio de sesión
router.post("/login", loginUser);

// Ruta para Crear Partida
router.post("/crearPartida", verificarToken, crearPartida);
router.put("/finalizarPartida/:gameId", finalizarPartida)

//Ruta para listar todas las partidas (admin)
router.get("/games", listarPartidas);

//Ruta para listar todas las partidas de un usuario
router.get("/games/:userId", verificarToken, listarPartidasPorId);

//Eleccion y consulta de rol
router.put('/users/:userId/games/:gameId/assign-role/:userRoleId', verificarToken, assignUserRoleInGame);
router.get('/users/:userId/games/:gameId/user-role', verificarToken, consultarRolUsuarioEnPartida);

//Agregar jugadores
router.put("/games/:gameId/agregarJugadores",verificarToken, agregarJugadores);
// Ruta para cargar una partida por ID
router.get("/games/:gameId/cargarPartida", verificarToken, cargarPartidaPorId);

// Rutas para mensajes
router.post("/messages/:gameId", crearMensaje);
router.delete("/messages/:id", eliminarMensajePorId);
router.get("/messages/:gameId", obtenerMensajesPorPartida);
export default router;
