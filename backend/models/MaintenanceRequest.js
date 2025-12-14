import mongoose from "mongoose";

const maintenanceSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Admission", required: true },
    issueType: { type: String, enum: ["Plumbing", "Electrical", "Carpentry", "Pest Control"], required: true },
    priority: { type: String, enum: ["Low", "Medium", "High"], required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("MaintenanceRequest", maintenanceSchema);
