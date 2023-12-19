// Controlador de creación de partidas
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const crearPartida = async (req, res) => {
  try {
    // Obtiene los datos del cuerpo de la solicitud
    const { userId, datosPartida } = req.body;

    console.log(`Validación datos: ${userId}, ${datosPartida.state} `);

    // Validación de datos
    if (!userId || typeof userId !== "number") {
      return res.status(400).json({ error: "userId no válido." });
    }
    console.log("usuario valido.");

    if (!datosPartida || typeof datosPartida.state !== "string") {
      return res
        .status(400)
        .json({ error: "Los datos de la partida son inválidos." });
    }
    console.log(`Datos válidos: ${datosPartida.state}`);

    // Crea la partida en la base de datos
    const nuevaPartida = await prisma.game.create({
      data: {
        state: datosPartida.state,
        players: {
          connect: { id: userId }, // Conecta al creador con la partida
        },
        creator: {
          connect: { id: userId }, // Crea un nuevo usuario como creador de la partida
        },
      },
    });

    // Devuelve la nueva partida creada
    return res.status(201).json(nuevaPartida);
  } catch (error) {
    console.error("Error al crear la partida:", error.message);
    return res.status(500).json({ error: "No se pudo crear la partida." });
  }
};


// Controlador de actualización de partidas
export const updatePartida = async (req, res) => {
  try {
    // Obtiene los datos del cuerpo de la solicitud
    const { gameId } = req.params;
    const { userIds } = req.body;

    // Asegúrate de que el gameId sea un número válido
    if (!gameId || isNaN(parseInt(gameId))) {
      return res.status(400).json({ error: "gameId no válido." });
    }

    console.log(`Agregando jugadores a la partida ${gameId}: ${userIds}`);

    // Obtén la partida existente
    const partidaExistente = await prisma.game.findUnique({
      where: { id: parseInt(gameId) },
      include: { players: true },
    });

    if (!partidaExistente) {
      return res.status(404).json({ error: "Partida no encontrada." });
    }

    // Asegúrate de que los userIds sean un array válido
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ error: "userIds no válido." });
    }

    // Filtra los userIds que ya están en la partida
    const nuevosUserIds = userIds.filter(
      (userId) =>
        !partidaExistente.players.some((player) => player.id === userId)
    );

    // Conecta los nuevos jugadores a la partida
    const partidaActualizada = await prisma.game.update({
      where: { id: parseInt(gameId) },
      data: {
        players: {
          connect: nuevosUserIds.map((userId) => ({ id: userId })),
        },
      },
    });

    // Devuelve la partida actualizada
    return res.status(200).json(partidaActualizada);
  } catch (error) {
    console.error("Error al agregar jugadores a la partida:", error.message);
    return res.status(500).json({
      error: "No se pudieron agregar jugadores a la partida.",
    });
  }
};

