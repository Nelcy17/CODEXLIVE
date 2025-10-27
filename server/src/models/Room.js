import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  code: { type: String, default: "" },       
  users: [{ userId: String, username: String, socketId: String }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Room", RoomSchema);
