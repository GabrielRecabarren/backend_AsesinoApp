// Controlador de creación de partidas
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

export const crearPartida = async (req, res) => {
  try {
    // Obtiene los datos del cuerpo de la solicitud
    const { userId, datosPartida } = req.body;

    console.log(`Validación datos: ${userId}, ${datosPartida.state}, ${datosPartida.name} `);

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
        name: datosPartida.name,
        players: {
          connect: [
            { id: userId },
            { id: 0 },
          ],
        },
        creator: {
          connect: { id: userId }, // Crea un nuevo usuario como creador de la partida
        },
        roles: {
          create: [
            {
              user: { connect: { id: userId } },
              role: 'DEFAULT', // Ajusta el rol según sea necesario
              isAlive: true
            },
            {
              user: { connect: { id: 0 } },
              role: 'DEFAULT', // Ajusta el rol según sea necesario
              isAlive: true
            },
          ],
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
    const parsedUserIds = userIds.map((id) => parseInt(id, 10));
    console.log(typeof parsedUserIds);

    // Asegúrate de que el gameId sea un número válido
    if (!gameId || isNaN(parseInt(gameId))) {
      console.log("no hay game id o no es valido");
      return res.status(400).json({ error: "gameId no válido." });
    }

    // Asegúrate de que los userIds sean un array válido
    if (!userIds) {
      console.log("no hay users id o no es valido");

      return res
        .status(400)
        .json({ error: "userIds debe ser un array válido de números." });
    }

    console.log(`Agregando jugadores a la partida ${gameId}: ${userIds}`);

    // Obtén la partida existente
    const partidaExistente = await prisma.game.findUnique({
      where: { id: parseInt(gameId) },
      include: { players: true },
    });
    console.log(`Partida Existente: ${partidaExistente.id}`);

    if (!partidaExistente) {
      console.log("Partida No encontrada");
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
      return res.status(404).json({ error: "Juego no encontrado" });
    }

    res.json(game.players);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
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
  const { userId } = req.params;

  if (!userId) {
    return res.status(500).json({ error: "Revisar ID Usuario" });
  } else {
    try {
      const partidasPorID = await prisma.game.findMany({
        where: {
          OR: [
            { creatorId: parseInt(userId) }, // Filtrar por el ID del creador
            { players: { some: { id: parseInt(userId) } } }, // Filtrar por el ID del jugador
          ],
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
      return res.status(200).json(partidasPorID);
    } catch (error) {
      console.log("Error en listarPartidasPorId:", error);
      return res
        .status(500)
        .json({ error: "No se pueden buscar las partidas." });
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
export const assignUserRoleInGame = async (req, res) => {
  const { userId, gameId, userRoleId } = req.params;

  try {
    // Verificar si el usuario y la partida existen
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    const game = await prisma.game.findUnique({
      where: { id: parseInt(gameId) },
    });

    if (!user || !game) {
      return res
        .status(404)
        .json({ message: "Usuario o partida no encontrada" });
    }

    // Verificar si el userRoleId es un valor válido del enum UserRole
    if (!Object.values(UserRole).includes(userRoleId)) {
      return res.status(400).json({ message: "UserRole no válido" });
    }

    console.log("Validaciones ok");

    // Verificar si ya existe un registro con el userId y gameId
    const existingUserRoleInGame = await prisma.userRoleInGame.findUnique({
      where: {
        userId_gameId: {
          userId: parseInt(userId),
          gameId: parseInt(gameId),
        },
      },
    });

    if (existingUserRoleInGame) {
      // Actualizar el registro existente con el nuevo rol
      await prisma.userRoleInGame.update({
        where: {
          id: existingUserRoleInGame.id,
        },
        data: {
          role: userRoleId,
        },
      });

      return res
        .status(200)
        .json({
          message: `El rol del Usuario ${userId} en la partida ${gameId} ha sido actualizado a ${userRoleId}.`,
        });
    }

    // Crear un nuevo registro UserRoleInGame si no existe
    await prisma.userRoleInGame.create({
      data: {
        user: { connect: { id: parseInt(userId) } },
        game: { connect: { id: parseInt(gameId) } },
        role: userRoleId,
      },
    });

    console.log(
      `UserRole ${userRoleId} asignado al Usuario ${userId} en la partida ${gameId} exitosamente.`
    );

    return res
      .status(200)
      .json({
        message: `UserRole ${userRoleId} asignado al Usuario ${userId} en la partida ${gameId} exitosamente.`,
      });
  } catch (error) {
    console.error("Error al asignar UserRole:", error);
    return res.status(500).json({ error: "Error al asignar UserRole" });
  }
};



// Consultar el rol de un usuario en una partida
export const consultarRolUsuarioEnPartida = async (req, res) => {
  const { userId, gameId } = req.params;
  try {
    // Buscar la relación UserRoleInGame para el usuario y la partida específicos
    const userRoleInGame = await prisma.userRoleInGame.findFirst({
      where: {
        userId: parseInt(userId),
        gameId: parseInt(gameId),
      },
    });

    if (!userRoleInGame) {
      return res
        .status(404)
        .json({ message: "No se encontró el rol del usuario en la partida." });
    }
    console.log("check1");

    // Obtener el nombre del rol del usuario
    const userRole = userRoleInGame.role;

    //Obtener el estado del usuario
    const userState = userRoleInGame.isAlive;
    console.log(userRole, userState, "aquisss")
    return res.status(200).json({ userRole, userState });
  } catch (error) {
    console.error(
      "Error al consultar el rol del usuario en la partida:",
      error
    );
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};



// Controlador para consultar si un usuario está vivo en una partida
export const consultarEstadoVidaMuerte = async (req, res) => {
  console.log("ConsultaEstaddo en El bACK")
  try {
    // Obtiene los datos del cuerpo de la solicitud
    const { gameId, userId } = req.params;

    // Asegúrate de que gameId y userId sean números válidos
    if (!gameId || isNaN(parseInt(gameId)) || !userId || isNaN(parseInt(userId))) {
      return res.status(400).json({ error: "gameId o userId no válido." });
    }

    console.log(`Consultando estado de vida/muerte del usuario ${userId} en la partida ${gameId}`);

    // Consulta el estado de vida/muerte del usuario en la partida correspondiente
    const userRoleInGame = await prisma.userRoleInGame.findFirst({
      where: {
        userId: parseInt(userId),
        gameId: parseInt(gameId),
      },
      select: {
        isAlive: true,
      },
    });

    // Si el usuario no está en la partida o no se encuentra el estado de vida/muerte, devuelve un error
    if (!userRoleInGame) {
      return res.status(404).json({ error: "Usuario no encontrado en la partida." });
    }

    // Devuelve el estado de vida/muerte del usuario en la partida
    return res.status(200).json({ estaVivo: userRoleInGame.isAlive });
  } catch (error) {
    console.error("Error al consultar el estado de vida/muerte del usuario en la partida:", error.message);
    return res.status(500).json({ error: "No se pudo consultar el estado de vida/muerte del usuario en la partida." });
  }
};

//Actualizar Estado del Jugador
export const actualizarEstadoJugador = async (req, res) => {
  try {
    const { userId, gameId, isAlive } = req.body;
    console.log(`actualizar estado del jugador ${userId} en la partida ${gameId}`)
    
    // Validación de datos
    if (!userId || typeof userId !== "number" || !gameId || typeof gameId !== "number") {
      return res.status(400).json({ error: "Datos no válidos." });
    }

    // Actualiza el estado del jugador en la partida
    const updatedRole = await prisma.userRoleInGame.updateMany({
      where: {
        userId: userId,
        gameId: gameId,
      },
      data: {
        isAlive: isAlive,
      },
    });

    if (updatedRole.count === 0) {
      return res.status(404).json({ error: "Usuario o partida no encontrados." });
    }

    return res.status(200).json({ message: "Estado del jugador actualizado." });
  } catch (error) {
    console.error("Error al actualizar el estado del jugador:", error.message);
    return res.status(500).json({ error: "No se pudo actualizar el estado del jugador." });
  }
};

