import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Obtener todos los mensajes
const obtenerTodosLosMensajes = async (req, res) => {
  try {
    const mensajes = await prisma.message.findMany();
    res.json(mensajes);
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Crear un nuevo mensaje
const crearMensaje = async (req, res) => {
  const { texto, idRemitente } = req.body;
  
  try {
    const nuevoMensaje = await prisma.message.create({
      data: {
        texto,
        idRemitente,
      },
    });

    res.json(nuevoMensaje);
  } catch (error) {
    console.error('Error al crear mensaje:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Eliminar un mensaje por ID
const eliminarMensajePorId = async (req, res) => {
  const idMensaje = parseInt(req.params.id);

  try {
    const mensajeEliminado = await prisma.message.delete({
      where: {
        id: idMensaje,
      },
    });

    res.json(mensajeEliminado);
  } catch (error) {
    console.error('Error al eliminar mensaje:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export { obtenerTodosLosMensajes, crearMensaje, eliminarMensajePorId };
