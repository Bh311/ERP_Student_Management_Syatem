import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String, // hashed
  role: { type: String, enum: ["admin", "student"], default: "student" },
  linkedStudent: { type: mongoose.Schema.Types.ObjectId, ref: "Admission" },
});

export default mongoose.model("User", userSchema);
