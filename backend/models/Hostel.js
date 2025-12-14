import mongoose from "mongoose";

const floorSchema = new mongoose.Schema({
  name: { type: String, enum: ["GF", "FF", "SF"], required: true },
  occupiedRooms: { type: Number, default: 0 },
});

const hostelSchema = new mongoose.Schema(
  {
    name: { type: String, enum: ["H1", "H2"], required: true, unique: true },
    gender: { type: String, enum: ["Boys", "Girls"], required: true },
    totalRooms: { type: Number, default: 150 },
    occupiedRooms: { type: Number, default: 0 },
    reservedRooms: { type: Number, default: 0 }, // Added this new field
    floors: {
      type: [floorSchema],
      default: [
        { name: "GF", occupiedRooms: 0 },
        { name: "FF", occupiedRooms: 0 },
        { name: "SF", occupiedRooms: 0 },
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Hostel", hostelSchema);