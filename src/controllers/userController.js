import pkg from "@prisma/client";
const { PrismaClient, UserRole } = pkg;
const prisma = new PrismaClient();
import jwt from 'jsonwebtoken';
import 'dotenv/config';

// Función para generar tokens
const generarToken = (datosUsuario) => {
  const token = jwt.sign(datosUsuario, process.env.SECRET_KEY);
  return token;
};

//Metodos de usuarios
//Crear Usuario
export const createUser = async (req, res) => {
  const userData = req.body;

  try {
    // Verificar si el correo electrónico ya está en uso
    const existingUser = await prisma.user.findUnique({
      where: {
        email: userData.email,
      },
    });

    if (existingUser) {
      throw new Error('El correo electrónico ya está en uso');
    }
    const newUser = await prisma.user.create({
      data: userData,
    });

    res.json(newUser);
    console.log(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear usuario" });
  }
};

//Obtener Usuarios
export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await prisma.user.findMany();
    res.json(allUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

//Obtener 1 Usuario
export const getUser = async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: "Error al obtener usuario" });
  }
};

//Actualizar usuario
export const updateUser = async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const updatedUserData = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: updatedUserData,
    });

    console.error("Usuario Actualizado");
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};
//Eliminar Usuario
export const deleteUser = async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  try {
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    console.log("Usuario Eliminado");
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
};

// Controlador para el inicio de sesión
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar las credenciales utilizando Prisma
    const user = await prisma.user.findUnique({
      where: {
        email: email,
        password: password,
      },
    });

    if (user) {   
      // Usuario válido
      const token = generarToken(user);

      res.json({ success: true, message: "Inicio de sesión exitoso", user, token });

      
    } else {
      // Usuario no encontrado o contraseña incorrecta
      res
        .status(401)
        .json({ success: false, message: "Credenciales incorrectas" });
    }
  } catch (error) {
    console.error("Error al intentar iniciar sesión:", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
};


export const changeUserRole = async (req, res) => {
  const { userId, newRole } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role: newRole,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error al cambiar el rol del usuario:', error);
    res.status(500).json({ error: 'Error al cambiar el rol del usuario' });
  }
};
