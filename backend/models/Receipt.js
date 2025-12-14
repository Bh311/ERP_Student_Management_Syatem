import mongoose from "mongoose";

const receiptSchema = new mongoose.Schema(
  {
    feeAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FeeAccount",
      required: true,
    },
    txnId: { type: String, required: true },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admission",
      required: true,
    },
    amount: { type: Number, required: true },
    feeType: {
      type: String,
      enum: ["tuition", "hostel", "library"],
      required: true,
    },
    date: { type: Date, default: Date.now },
    receiptUrl: { type: String }, // or store PDF file path
    generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Receipt", receiptSchema);
