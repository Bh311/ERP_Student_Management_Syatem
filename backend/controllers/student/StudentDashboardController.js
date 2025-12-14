import Admission from "../../models/Admission.js";
import FeeAccount from "../../models/FeeAccount.js";

class StudentDashboardController {

  static getDashboardData = async (req, res) => {
    try {
      const studentId = req.user.linkedStudent;

      // Fetch only needed academic and hostel fields
      const student = await Admission.findById(studentId)
        .select("academics.sgpa academics.semester hostel");

      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found",
        });
      }

      // ----------------------------
      // CALCULATE CGPA FROM SGPA ARRAY
      // ----------------------------
      let cgpa = 0;

      if (student.academics.sgpa && student.academics.sgpa.length > 0) {
        const sgpaList = student.academics.sgpa.map(Number);
        const total = sgpaList.reduce((sum, val) => sum + val, 0);
        cgpa = (total / sgpaList.length).toFixed(2);
      }

      // ----------------------------
      // FEES
      // ----------------------------
      const feeAccount = await FeeAccount.findOne({ student: studentId });
      const pendingFees = feeAccount ? feeAccount.balance : 0;

      // ----------------------------
      // STATIC ATTENDANCE
      // ----------------------------
      const attendance = {
        percentage: 92,
        monthly: [
          { name: "Jan", value: 92 },
          { name: "Feb", value: 90 },
          { name: "Mar", value: 95 },
          { name: "Apr", value: 88 },
        ],
      };

      // ----------------------------
      // CGPA PROGRESS GRAPH
      // ----------------------------
      const cgpaProgress = student.academics.sgpa.map((sgpa, index) => ({
        name: `Sem ${index + 1}`,
        value: sgpa,
      }));

      // ----------------------------
      // HOSTEL INFORMATION
      // ----------------------------
      let hostelInfo = null;

      if (student.hostel?.status === "Accepted" || student.hostel?.status === "Allotted") {
        hostelInfo = {
          roomNumber: student.hostel.roomNumber,
          hostelNumber: student.hostel.hostelNumber,
        };
      }

      // ----------------------------
      // FINAL RESPONSE
      // ----------------------------
      return res.status(200).json({
        success: true,
        data: {
          cgpa,
          pendingFees,
          attendance,
          cgpaProgress,
          hostel: hostelInfo,
        },
      });

    } catch (error) {
      console.error("Dashboard Error:", error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  };
}

export default StudentDashboardController;
