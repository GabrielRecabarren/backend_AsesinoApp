// socket.js

import { Server } from "socket.io";

const gameRooms = {};
const canalesPersonales = {};

export default function initializeSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Manejar eventos de Socket.io
  io.on("connection", (socket) => {
    console.log(`[${socket.id}] socket connected en puerto 3000`);


    console.log("Usuario conectado:", socket.id);

    //MAnejar cuando el usuario se conecta a una sala
    let selectedRoom = undefined;
    let canalPersonal = undefined
    //Cuando un usuario se una a una partida
    socket.on("join-game", (gameId, userId) => {
      selectedRoom = gameRooms[`partida_${gameId}`];
      if (!selectedRoom) {
        selectedRoom = `partida_${gameId}`;
        gameRooms[gameId] = selectedRoom; // Guardar la sala de juego en gameRooms
      }
      socket.join(selectedRoom);
      //Abrimos su canal personal
      canalPersonal = canalesPersonales[`canal_${gameId}_${userId}`]
      if (!canalPersonal) {
        canalPersonal = `canal_${gameId}_${userId}`
        socket.join(canalPersonal);
        console.log(`unido con exito a canal ${canalPersonal} y sala ${selectedRoom}`);
      }
    });

    // Manejar el evento de chat message
    socket.on("chat-message", (msg, callback) => {
      if (selectedRoom) {
        io.to(selectedRoom).emit("chat-message", msg, () => {
          // Enviar una respuesta al callback del cliente
          callback({
            success: true,
            message:
              "Mensaje recibido correctamente a todos los usuarios desde el backend",
          });
        });
      } else {
        // Enviar una respuesta de error si la sala de chat no existe
        callback({ success: false, message: "La partida no existe" });
      }
    });

    //Manejando evento de rol
    socket.on("action-rol", (actionData, callback) => {
      console.log(actionData);
      const { destinatario, gameId } = actionData;
      //Canal usuarioElegido
      const canalUsuarioElegido = `canal_${gameId}_${destinatario}`
      if (actionData) {

        io.to(canalUsuarioElegido).emit("action-rol", actionData);
      }
      else {

        console.error("Accion desconocida");
      }
      callback("Mensaje recibido correctamente en el servidor");
    });



    //Si el destinatario confirma la accion, llega este mensaje
    socket.on("confirmar-accion", (actionData, callback) => {
      //Le notificamos al canal personal
      const { destinatario, gameId, userRol } = actionData;
      //Canal usuarioElegido
      const canalUsuarioElegido = `canal_${gameId}_${destinatario}`
      io.to(canalUsuarioElegido).emit(`${userRol}-exitoso`);
      callback("Acción confirmada");

    });

    // Manejar evento de increpar
    socket.on("increpar", (increparData, callback) => {
      try {
        const { selectedPlayer, gameId } = increparData;
        console.log(increparData, "Increpar Data Recibida en servidor");

        // Verificar si increparData tiene los datos necesarios
        if (!selectedPlayer || !gameId) {
          throw new Error("Datos incompletos para increpar");
        }

        // Notificamos al increpado
        const canalUsuarioElegido = `canal_${gameId}_${selectedPlayer.id}`;

        io.to(canalUsuarioElegido).emit("increpar", increparData);

        callback("Increpar recibido correctamente en el servidor");
      } catch (error) {
        console.error("Error en el evento increpar:", error.message);
        // Si el callback está definido, devolver el error al cliente
        if (typeof callback === 'function') {
          callback(`Error: ${error.message}`);
        }
      }
    });

    socket.on('increpar-confirmado', (increparData) =>{
      console.log("increparconfirmado", increparData);
      const { gameId, userId } = increparData;
      const canalUsuarioElegido = `canal_${gameId}_${userId}`
      io.to(canalUsuarioElegido).emit(`increpado`);
    })


    socket.on("disconnect", (reason) => {
      console.log(`[${socket.id}] socket disconnected - ${reason}`);
    });
  });

  return io;
}
