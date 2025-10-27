import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { initSocket, getSocket } from "../utils/socket";
import { ACTIONS } from "../utils/actions";
import { v4 as uuidv4 } from "uuid";
import CodeEditor from "../components/CodeEditor";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

export default function EditorPage() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const location = useLocation();
  const username =
    location.state?.username || `User-${Math.floor(Math.random() * 1000)}`;
  const userId = useRef(uuidv4());
  const [users, setUsers] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
  const socket = initSocket(SERVER_URL);
  socketRef.current = socket;

  window.socket = socket;

  socket.emit(ACTIONS.JOIN, { roomId, username, userId: userId.current });
  socket.on(ACTIONS.JOINED, ({ users }) => setUsers(users));

  socket.on(ACTIONS.CODE_CHANGE, ({ code, language }) => {
    window.dispatchEvent(new CustomEvent("remoteCode", { detail: code }));
    if (language) {
     window.dispatchEvent(new CustomEvent("remoteLang", { detail: language }));
    }
  });

  socket.on(ACTIONS.SYNC_CODE, ({ code }) => {
    window.dispatchEvent(new CustomEvent("loadCode", { detail: code }));
  });

  socket.on(ACTIONS.DISCONNECTED, ({ users }) => setUsers(users));

  return () => {
    socket.emit(ACTIONS.LEAVE, { roomId, userId: userId.current });
    socket.disconnect();
    window.socket = null; 
  };
}, [roomId]);


  const handleCodeChange = (code, language) => {
    const socket = getSocket();
    if (socket && socket.connected) {
      socket.emit(ACTIONS.CODE_CHANGE, { roomId, code, language });
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between px-6 py-3 bg-gray-600 text-white">
        <h2 className="font-semibold">Room: {roomId}</h2>
      </header>

      <main className="flex-1 p-4 bg-gray-50">
        <CodeEditor
          onChange={handleCodeChange}
          joinedUsers={users.map((u) => u.username)}
          roomId={roomId}
          onLeave={() => navigate("/")}
        />
      </main>
    </div>
  );
}
