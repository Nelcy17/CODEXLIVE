import { ACTIONS } from "./utils/ACTIONS.js";
const userSocketMap = {}; 
const getAllConnectedClients = (io, roomId) => {
  const room = io.sockets.adapter.rooms.get(roomId);
  if (!room) return [];
  return Array.from(room).map((socketId) => ({
    socketId,
    username: userSocketMap[socketId],
  }));
};

export default function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("New connection:", socket.id);

    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
      userSocketMap[socket.id] = username;
      socket.join(roomId);

      const users = getAllConnectedClients(io, roomId);

      users.forEach(({ socketId }) => {
        io.to(socketId).emit(ACTIONS.JOINED, {
          users,
          socketId: socket.id,
          username,
        });
      });

      console.log(`${username} joined room ${roomId}`);
    });

    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code, language }) => {
      socket.to(roomId).emit(ACTIONS.CODE_CHANGE, { code, language });
    });

    socket.on(ACTIONS.SYNC_CODE, ({ roomId, code }) => {
      io.to(roomId).emit(ACTIONS.SYNC_CODE, { code });
    });

    socket.on(ACTIONS.LEAVE, ({ roomId }) => {
      socket.leave(roomId);
      delete userSocketMap[socket.id];

      const users = getAllConnectedClients(io, roomId);
      io.to(roomId).emit(ACTIONS.DISCONNECTED, { users });

      console.log(`${socket.id} left room ${roomId}`);
    });

    socket.on("disconnecting", () => {
      const rooms = [...socket.rooms];
      rooms.forEach((roomId) => {
        const username = userSocketMap[socket.id];
        delete userSocketMap[socket.id];

        const users = getAllConnectedClients(io, roomId);
        socket.to(roomId).emit(ACTIONS.DISCONNECTED, { users });

        console.log(`${username} disconnected from ${roomId}`);
      });
    });
    socket.on("run-output", ({ roomId, output, stdin }) => {
      socket.to(roomId).emit("run-output", { output, stdin });
    });
  });
}
