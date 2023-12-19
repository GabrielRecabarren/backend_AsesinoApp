// Controlador de creación de partidas
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const crearPartida = async (req, res) => {
  try {
    // Obtiene los datos del cuerpo de la solicitud
    const { userId, datosPartida } = req.body;

    // Validación de datos
    if (!userId || typeof userId !== 'number') {
      return res.status(400).json({ error: 'userId no válido.' });
    }

    if (!datosPartida || typeof datosPartida.estado !== 'string') {
      return res.status(400).json({ error: 'Los datos de la partida son inválidos.' });
    }

    // Crea la partida en la base de datos
    const nuevaPartida = await prisma.game.create({
      data: {
        state: datosPartida.estado,
        players: {
          connect: { id: userId } // Conecta al creador con la partida
        },
        creator: {
          connect: { id: userId } // Crea un nuevo usuario como creador de la partida
        }
      }
    });
    

    // Devuelve la nueva partida creada
    return res.status(201).json(nuevaPartida);
  } catch (error) {
    console.error('Error al crear la partida:', error.message);
    return res.status(500).json({ error: 'No se pudo crear la partida.' });
  }
};
