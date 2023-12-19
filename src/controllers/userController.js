import pkg from '@prisma/client';
const { PrismaClient, UserRole } = pkg;
const prisma = new PrismaClient();

//Metodos de usuarios
//Crear Usuario
export const createUser = async (req, res) => {
  const userData = req.body;

  try {
    const newUser = await prisma.user.create({
      data: userData,
    });

    res.json(newUser);
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
      res.status(500).json({ error: 'Error al actualizar usuario' });
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
      res.json({ success: true, message: 'Inicio de sesión exitoso', user });
    } else {
      // Usuario no encontrado o contraseña incorrecta
      res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }
  } catch (error) {
    console.error('Error al intentar iniciar sesión:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

