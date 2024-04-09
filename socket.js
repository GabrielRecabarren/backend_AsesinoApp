// socket.js

import { Server } from "socket.io";

const gameRooms = {};
const canalesPersonales = {};
const canalesPrivados ={};

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
    socket.on("action-rol", (accion, destinatario,gameId, callback) => {
      const canalUsuarioElegido = `canal_${gameId}_${destinatario}`
      console.log("Acción Rol:  ", accion, destinatario, gameId);
      switch (accion) {
        case "asesinar":
          console.log("Un asesinato está sucediendo");
          io.to(canalUsuarioElegido).emit("action-rol", accion, destinatario, gameId);
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
