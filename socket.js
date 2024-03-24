// socket.js

import { Server } from "socket.io";

const gameRooms = {};
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

    // Emite un evento de conexión a todos los clientes
    io.emit("connection");

    console.log("Usuario conectado:", socket.id);

    //MAnejar cuando el usuario se conecta a una sala
    let selectedRoom = undefined;
    //Cuando un usuario se una a una partida
    socket.on("join-game", (gameId) => {
      console.log(gameId + " joined the room.");
      selectedRoom = gameRooms[gameId];
      if (!selectedRoom) {
        selectedRoom = `partida_${gameId}`;
        gameRooms[gameId] = selectedRoom; // Guardar la sala de juego en gameRooms

      }
      const joinedRoom = socket.join(selectedRoom);
      console.log(`Unido con exito a la sala ${joinedRoom}`);
    });

    // Manejar el evento de chat message
    socket.on("chat-message", (msg, gameId, callback) => {
      console.log(`Llega el mensaje : ${msg}`);
      if (selectedRoom) {
        io.to(selectedRoom).emit("chat-message", msg, () => {
          console.log("Se emite el mensaje recibido desde el backend:", msg);
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

    socket.on("disconnect", (reason) => {
      console.log(`[${socket.id}] socket disconnected - ${reason}`);
    });
  });

  

  return io;
}
