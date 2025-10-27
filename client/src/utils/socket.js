import { io } from "socket.io-client";

let socket;

export const initSocket = (serverUrl) => {
  socket = io(serverUrl);
  return socket;
};

export const getSocket = () => socket;
