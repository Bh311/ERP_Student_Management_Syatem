import mongoose from "mongoose";

const hostelFeeStructureSchema = new mongoose.Schema(
  {
    academicYear: { type: String, required: true, unique: true },
    hostelFee: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("HostelFeeStructure", hostelFeeStructureSchema);