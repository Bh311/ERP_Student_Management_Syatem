import Admission from "../../models/Admission.js";

class StudentHostelController {
  
  /**
   * @desc Get the current hostel status for the logged-in student
   * @route GET /api/student/hostel/status
   * @access Student (Auth Required)
   */
  static getHostelStatus = async (req, res) => {
    try {
      const studentId = req.user.linkedStudent;
      const student = await Admission.findById(studentId).select("hostel");

      if (!student) {
        return res.status(404).json({ success: false, message: "Student record not found." });
      }

      return res.status(200).json({ success: true, data: student.hostel });
    } catch (error) {
      console.error("Error fetching hostel status:", error);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  };


  /**
   * @desc Allows an admitted student to apply for a hostel spot
   * @route POST /api/student/hostel/apply
   * @access Student (Auth Required)
   */
  static applyForHostel = async (req, res) => {
    try {
      const studentId = req.user.linkedStudent;
      const student = await Admission.findById(studentId);

      if (!student) {
        return res.status(404).json({ success: false, message: "Student record not found." });
      }

      // 1. Check if already applied (Condition 1)
      if (student.hostel.isRequested === true && student.hostel.status === "Applied") {
        return res.status(400).json({
          success: false,
          message: "You have already applied for the hostel. Please wait for the warden's decision.",
          currentStatus: student.hostel.status,
        });
      }

      // 2. Check if re-applying after a rejection or applying for the first time (Condition 2 & 3)
      const allowedToApply = 
        (student.hostel.isRequested === false) || // Never applied or fully reset
        (student.hostel.isRequested === true && student.hostel.status === "Rejected") || // Rejected previously
        (student.hostel.isRequested === true && student.hostel.status === "Not Applied"); // Should not happen with new default, but good to check

      if (!allowedToApply) {
          return res.status(400).json({
              success: false,
              message: `Cannot apply at this time. Current status is ${student.hostel.status}.`,
          });
      }


      // Update the student's hostel request fields
      student.hostel.isRequested = true;
      student.hostel.status = "Applied";
      student.hostel.hostelNumber = null;
      student.hostel.roomNumber = null;
      student.hostel.reservationExpiryDate = null;

      await student.save();

      return res.status(200).json({
        success: true,
        message: "Hostel application submitted successfully. The warden will review your request shortly.",
        data: student.hostel,
      });

    } catch (error) {
      console.error("Error applying for hostel:", error);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  };
}

export default StudentHostelController;