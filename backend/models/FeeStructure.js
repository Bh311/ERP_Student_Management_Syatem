import mongoose from "mongoose";

const breakdownSchema = new mongoose.Schema(
  {
    tuition: { type: Number, default: 0 },
    library: { type: Number, default: 0 },
    hostel: { type: Number, default: 0 },
  },
  { _id: false }
);

const feeStructureSchema = new mongoose.Schema(
  {
    course: { type: String, required: true }, // e.g. "B.Tech CSE"
    semester: { type: Number, required: true }, // e.g. 1
    academicYear: { type: String }, // e.g. "2025-26"
    totalFee: { type: Number, required: true },
    breakdown: breakdownSchema,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Prevent duplicates per course+semester+academicYear
feeStructureSchema.index(
  { course: 1, semester: 1, academicYear: 1 },
  { unique: true }
);

export default mongoose.model("FeeStructure", feeStructureSchema);
