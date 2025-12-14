import mongoose from "mongoose";

const admissionSchema = new mongoose.Schema(
  {
    studentID: {
      type: String,
      unique: true,
      default: () => "STU" + Date.now(),
    },
    fullname: String,
    profilePic: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    email: { type: String, unique: true },
    phone: String,
    dob: Date,
    gender: String,
    address: String,
    academics: {
      course: String,
      semester: { type: Number, required: true },
      sgpa: [{ type: Number }], // array of SGPA scores
      tenthSchool: String,
      tenthPercent: Number,
      twelfthSchool: String,
      twelfthPercent: Number,
      academicYear: { type: String },
    },
    status: {
      type: String,
      enum: ["Applied", "Verified", "Enrolled", "Rejected"],
      default: "Applied",
    },
    // Add the new hostel sub-document
    hostel: {
      isRequested: { type: Boolean, default: false },
      status: {
        type: String,
        enum: ["Applied", "Accepted", "Rejected", "Allotted","Not Applied"],
        default: "Not Applied",
      },
      hostelNumber: { type: String, default: null }, // e.g., H1, H2
      roomNumber: { type: String, default: null }, // e.g., GF-1, FF-10
      reservationExpiryDate: { type: Date, default: null },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Admission", admissionSchema);