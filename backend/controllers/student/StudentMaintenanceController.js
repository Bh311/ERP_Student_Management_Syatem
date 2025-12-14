import MaintenanceRequest from "../../models/MaintenanceRequest.js";
import Admission from "../../models/Admission.js";

class StudentMaintenanceController {
    
  /**
   * @desc Create a new maintenance request
   * @route POST /api/student/maintenance/request
   */
  static createRequest = async (req, res) => {
    try {
      const studentId = req.user.linkedStudent;

      const { issueType, priority, description } = req.body;

      if (!issueType || !priority || !description) {
        return res.status(400).json({
          success: false,
          message: "All fields are required.",
        });
      }

      const newRequest = await MaintenanceRequest.create({
        student: studentId,
        issueType,
        priority,
        description,
      });

      return res.status(201).json({
        success: true,
        message: "Maintenance request submitted successfully.",
        data: newRequest,
      });
    } catch (error) {
      console.error("Error creating maintenance request:", error);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  };

  /**
   * @desc Get all maintenance requests for logged-in student
   * @route GET /api/student/maintenance/list
   */
  static getMyRequests = async (req, res) => {
    try {
      const studentId = req.user.linkedStudent;

      const requests = await MaintenanceRequest.find({ student: studentId })
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: requests.length,
        data: requests,
      });
    } catch (error) {
      console.error("Error fetching maintenance list:", error);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  };
}

export default StudentMaintenanceController;
