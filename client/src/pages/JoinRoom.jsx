import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

export default function JoinRoom() {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const createRoom = () => {
    const id = uuidv4();
    setRoomId(id);
    if (username) {
      navigate(`/room/${id}`, { state: { username } });
    } else {
      alert("Please enter your username before creating a room.");
    }
  };

  const joinRoom = () => {
    if (!roomId || !username) return alert("Enter room ID and username");
    navigate(`/room/${roomId}`, { state: { username } });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 p-4">
      <div className="bg-gray-800 border border-gray-700 shadow-2xl rounded-xl p-8 w-full max-w-md text-white">
        <h1 className="text-4xl font-extrabold text-center mb-2 tracking-wide drop-shadow-lg">
          <span className="text-yellow-300">Code</span>Sync
        </h1>
        <h2 className="text-lg text-center mb-8 text-gray-200 font-medium">
          Realtime Code Collaboration Platform
        </h2>

        <div className="space-y-5">
          <input
            type="text"
            placeholder="🔑 Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full p-3 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-300"
          />

          <input
            type="text"
            placeholder="👤 Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-300"
          />
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={joinRoom}
            className="flex-1 bg-yellow-400 text-gray-900 font-semibold py-2 rounded-xl hover:bg-yellow-300 transition-transform transform hover:scale-105"
          >
            Join Room
          </button>
          <button
            onClick={createRoom}
            className="bg-green-500 text-white font-semibold px-4 py-2 rounded-xl hover:bg-green-400 transition-transform transform hover:scale-105"
          >
            Create Room
          </button>
        </div>

        <p className="text-center text-gray-300 mt-8 text-sm">
          Don’t have a room?{" "}
          <span className="font-semibold">Create one now!</span>
        </p>
      </div>
    </div>
  );
}
