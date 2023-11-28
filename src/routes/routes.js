import { Router } from "express";
import { getAllUsers, getUser, createUser, updateUser, deleteUser } from "../controllers/userController.js";

const router = Router();

// Ruta para obtener todos los usuarios
router.get('/users', getAllUsers);

// Ruta para obtener 1 usuario por ID
router.get('/users/:id', getUser);

// Ruta para crear un nuevo usuario
router.post('/createUser', createUser);

// Ruta para actualizar un usuario existente por ID
router.put('/users/:id', updateUser);

// Ruta para eliminar un usuario por ID
router.delete('/users/:id', deleteUser);

export default router;
