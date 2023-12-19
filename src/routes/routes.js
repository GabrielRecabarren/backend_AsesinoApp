import { Router } from 'express';
import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser
} from '../controllers/userController.js';

import { crearPartida } from '../controllers/gameController.js';

import {
  obtenerTodosLosMensajes,
  crearMensaje,
  eliminarMensajePorId,
} from '../controllers/messageController.js';

const router = Router();

// Rutas para usuarios
router.get('/users', getAllUsers);
router.get('/users/:id', getUser);
router.post('/createUser', createUser);
router.put('/users/:id', updateUser);
router.delete('/deleteUser/:id', deleteUser);

// Ruta para inicio de sesión
router.post('/login', loginUser);

// Ruta para Crear Partida
router.post('/crearPartida', crearPartida)

// Rutas para mensajes
router.get('/messages', obtenerTodosLosMensajes);
router.post('/messages', crearMensaje);
router.delete('/messages/:id', eliminarMensajePorId);

export default router;
