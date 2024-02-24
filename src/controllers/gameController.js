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
    const parsedUserIds=userIds.map(id => parseInt(id, 10));
    console.log(typeof(parsedUserIds));

    // Asegúrate de que el gameId sea un número válido
    if (!gameId || isNaN(parseInt(gameId))) {
      console.log("no hay game id o no es valido");
      return res.status(400).json({ error: "gameId no válido." });
    }

    // Asegúrate de que los userIds sean un array válido
    if (!userIds ) {
      console.log("no hay users id o no es valido");

      return res.status(400).json({ error: "userIds debe ser un array válido de números." });
    }

    console.log(`Agregando jugadores a la partida ${gameId}: ${userIds}`);

    // Obtén la partida existente
    const partidaExistente = await prisma.game.findUnique({
      where: { id: parseInt(gameId) },
      include: { players: true },
    });
    console.log(`Partida Existente: ${partidaExistente.id}`)

    if (!partidaExistente) {
      console.log("Partida No encontrada")
      return res.status(404).json({ error: "Partida no encontrada." });
    }

    // Filtra los userIds que ya están en la partida
    const nuevosUserIds = parsedUserIds.filter(
      (userId) =>
        !partidaExistente.players.some((player) => player.id === userId)
    );

    // Conecta los nuevos jugadores a la partida dentro de una transacción
    const partidaActualizada = await prisma.$transaction(async (prisma) => {
      return prisma.game.update({
        where: { id: parseInt(gameId) },
        data: {
          players: {
            connect: nuevosUserIds.map((userId) => ({ id: userId })),
          },
        },
        include: {
          players: {
            select: {
              username: true,
            },
          },
        },
      });
    });

    // Devuelve la partida actualizada
    console.log(partidaActualizada);
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
  const { gameId } = req.params;

  try {
    const game = await prisma.game.findUnique({
      where: { id: parseInt(gameId) },
      include: { players: true },
    });

    if (!game) {
      return res.status(404).json({ error: 'Juego no encontrado' });
    }

    res.json(game.players);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};



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
  console.log('Iniciando listarPartidasPorId');
  const { userId } = req.params;
  console.log(userId);

  if (!userId) {
    return res.status(500).json({ error: 'Revisar ID Usuario' });
  } else {
    try {
      const partidasPorID = await prisma.game.findMany({
        where: {
          creatorId: parseInt(userId),
          players: {
            some: {
              id: parseInt(userId),
            },
          },
        },
        include: {
          creator: {
            select: {
              username: true,
            },
          },
          players: true,
        },
      });
      console.log('Finalizando listarPartidasPorId');
      return res.status(200).json(partidasPorID);
    } catch (error) {
      console.log('Error en listarPartidasPorId:', error);
      return res.status(500).json({ error: 'No se pueden buscar las partidas.' });
    }
  }
};

// Controlador para cargar una partida por ID
export const cargarPartidaPorId = async (req, res) => {
  const { gameId } = req.params;

  try {
    // Busca la partida en la base de datos por su ID
    const partida = await Game.findOne({ where: { id: parseInt(gameId) } });

    if (!partida) {
      return res.status(404).json({ message: "Partida no encontrada" });
    }

    // Realiza las acciones necesarias para cargar la partida

    // Devuelve la partida cargada
    return res.status(200).json(partida);
  } catch (error) {
    console.error("Error al cargar la partida:", error);
    return res.status(500).json({ error: "Error al cargar la partida" });
  }
};