import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import socketHandler from "./socketHandler.js";
import axios from "axios";
import dotenv from "dotenv";
import { runCodeRoute } from "./runCode.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/run", runCodeRoute);

app.use(cors({
  origin: [ 
    "https://codexlive.vercel.app/",
    "http://localhost:5173" 
  ],

  methods: ["GET", "POST"],
}));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));


app.get("/", (req, res) => res.send("Realtime Collab server up"));


socketHandler(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server listening on ${PORT}`));
