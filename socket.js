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

    socket.on("canal-privado", (userId)=> {
      socket.userId = userId;
      socket.join(userId);
      console.log(socket.userId, "userId como sala privada");

    })

    

    // Emite un evento de conexión a todos los clientes
    socket.emit("bienvenida", "¡Bienvenido a la aplicación de Socket.io!");
    
    console.log("Usuario conectado:", socket.id, socket.userId);

    //MAnejar cuando el usuario se conecta a una sala
    let selectedRoom = undefined;
    //Cuando un usuario se una a una partida
    socket.on("join-game", (gameId) => {
      selectedRoom = gameRooms[gameId];
      if (!selectedRoom) {
        selectedRoom = `partida_${gameId}`;
        gameRooms[gameId] = selectedRoom; // Guardar la sala de juego en gameRooms
      }
      socket.join(selectedRoom);
    });

    // Manejar el evento de chat message
    socket.on("chat-message", (msg, gameId, callback) => {
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
    socket.on("action-rol", (msg, destinatario, callback) => {
      console.log("Acción Rol:  ", msg, destinatario);
      switch (msg) {
        case "asesinar":
          console.log("Un asesinato está sucediendo");
          io.to(destinatario).emit("action-rol", msg);
          break;
        default:
          console.error("Accion desconocida");
      }
      callback("Mensaje recibido correctamente en el servidor");
    });

    socket.on("disconnect", (reason) => {
      console.log(`[${socket.id}] socket disconnected - ${reason}`);
    });
  });

  return io;
}
