import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import JoinRoom from "./pages/JoinRoom";
import EditorPage from "./pages/EditorPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<JoinRoom />} />
        <Route path="/room/:roomId" element={<EditorPage />} />
      </Routes>
    </BrowserRouter>
  );
}
