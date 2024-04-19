import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Obtener todos los mensajes de una partida específica
const obtenerMensajesPorPartida = async (req, res) => {
  const gameId = parseInt(req.params.gameId);

  try {
    const mensajes = await prisma.message.findMany({
      where: {
        gameId: gameId,
      },
    });
    res.json(mensajes);
  } catch (error) {
    console.error('Error al obtener mensajes por partida:', error);
    res.status(500).json({ error: 'Error al obtener mensajes por partida' });
  }
};

// Crear un nuevo mensaje en una partida específica
const crearMensaje = async (req, res) => {
  const { texto, userId, gameId, role } = req.body;
  console.log(texto, userId,gameId, role);
  
  try {
    // Validar datos
    if (!texto || !userId || !gameId) {
      return res.status(400).json({ error: 'Faltan datos obligatorios para crear el mensaje' });
    }

   // Crear el mensaje con el campo `content`
   const nuevoMensaje = await prisma.message.create({
    data: {
      content: texto, // Aquí se utiliza `texto` para el campo `content`
      senderId: userId,
      gameId,
      role
    },
  });

    res.json(nuevoMensaje);
  } catch (error) {
    console.error('Error al crear mensaje:', error);
    res.status(500).json({ error: 'Error al crear el mensaje' });
  }
};

// Eliminar un mensaje por ID
const eliminarMensajePorId = async (req, res) => {
  const idMensaje = parseInt(req.params.id);

  try {
    const mensaje = await prisma.message.findUnique({
      where: {
        id: idMensaje,
      },
    });

    if (!mensaje) {
      return res.status(404).json({ error: 'El mensaje no existe' });
    }

    // Aquí podrías implementar lógica de autorización para verificar si el usuario tiene permiso para eliminar el mensaje

    const mensajeEliminado = await prisma.message.delete({
      where: {
        id: idMensaje,
      },
    });

    res.json(mensajeEliminado);
  } catch (error) {
    console.error('Error al eliminar mensaje:', error);
    res.status(500).json({ error: 'Error al eliminar el mensaje' });
  }
};

export { obtenerMensajesPorPartida, crearMensaje, eliminarMensajePorId };
