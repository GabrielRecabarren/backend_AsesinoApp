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

// Controlador para agregar jugadores a una partida existente
export const agregarJugadores = async (req, res) => {
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
        }
      },
      include: {
        players: {
          select: {
            username: true
          }
        }
      }
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

//Acceder a los jugadores de un juego
export const listarJugadores = async (req, res) => {
  await prisma.game.findUnique({
    where: { id: gameId },
    include: { players: true },
  });
};

console.log(listarJugadores.players);

// Controlador de listado de partidas
export const listarPartidas = async (req, res) => {
  try {
    console.log("Listando todas las partidas...");

    // Obtén todas las partidas de la base de datos
    const partidas = await prisma.game.findMany();

    // Devuelve las partidas obtenidas
    return res.status(200).json(partidas);
  } catch (error) {
    console.error("Error al listar las partidas:", error.message);
    return res.status(500).json({
      error: "No se pudieron obtener las partidas.",
    });
  }
};

// Controlador para finalizar una partida
export const finalizarPartida = async (req, res) => {
  try {
    // Obtiene los datos del cuerpo de la solicitud
    const { gameId } = req.params;
    console.log(gameId);

    // Asegúrate de que el gameId sea un número válido
    if (!gameId || isNaN(parseInt(gameId))) {
      return res.status(400).json({ error: "gameId no válido." });
    }

    console.log(`Finalizando la partida ${gameId}`);

    // Actualiza el estado de la partida a "Finalizada"
    const partidaFinalizada = await prisma.game.update({
      where: { id: parseInt(gameId) },
      data: {
        state: "Finalizada",
      },
    });

    // Devuelve la partida finalizada
    return res.status(200).json(partidaFinalizada);
  } catch (error) {
    console.error("Error al finalizar la partida:", error.message);
    return res.status(500).json({
      error: "No se pudo finalizar la partida.",
    });
  }
};

//Controlador para obtener las partidas asociadas a un id:
export const listarPartidasPorId = async (req, res) => {
  //Obtenemos el id del solicitante
  const { userId } = req.params;

  //Verificamos que exista
  if (!userId) {
    return res.status(500).json({ error: "Revisar ID Usuario" });
  } else {
  
    try {
    //Buscamos en  la base de datos
    const partidasPorID = await prisma.game.findMany({
      where: {
        creatorId: parseInt(userId),
        players:{
          some: {
            id: parseInt(userId)
          }
        }
      },
      include:{
        players:true
        }
      
      ,
    });
    //Devolvemos las partidas
    return res.status(200).json(partidasPorID);
  } catch (error) {
    //Avisamos error
    console.log(error);
    return res.status(500).json({error: "No se pueden buscar las partidas."});
  }
};
}