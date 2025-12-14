import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    mode: {
      type: String,
      default: "UPI",
    },
    txnId: { type: String }, // bank ref or gateway ref
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
    feeType: {
      type: String,
      enum: ["tuition", "hostel", "library"],
      required: true,
    },
    receiptId: { type: String },
    note: { type: String },
  },
  { timestamps: true }
);

const feeAccountSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admission",
      required: true,
      unique: true, // one account per student
    },
    totalFee: { type: Number, required: true },
    breakdown: {
      tuition: { type: Number, default: 0 },
      hostel: { type: Number, default: 0 },
      library: { type: Number, default: 0 },
    },

    paid: { type: Number, default: 0 },
    balance: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Paid", "Partial", "Unpaid", "Overdue"],
      default: "Unpaid",
    },

    dueDate: { type: Date, required: true },
    transactions: [transactionSchema],
  },
  { timestamps: true }
);

// Useful indexes
// feeAccountSchema.index({ student: 1 });
feeAccountSchema.index({ status: 1 });
feeAccountSchema.index({ updatedAt: -1 });

export default mongoose.model("FeeAccount", feeAccountSchema);
