import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
  username: String,
  passwordHash: String,
  role: { type: String, enum: ["Manager", "Staff"], default: "Staff" }
});

export default mongoose.model("Staff", staffSchema);