import FeeStructure from "../../models/FeeStructure.js";
import { validationResult } from "express-validator";

class AdminFeeStructureController {
  /**
   * @desc Create a new Fee Structure
   * @route POST /api/admin/fees/structures
   * @access Admin
   */
  static createStructure = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { course, semester, academicYear, breakdown } = req.body;

      // Check if already exists (avoid duplicate fee structure)
      const exists = await FeeStructure.findOne({ course, semester, academicYear });
      if (exists) {
        return res.status(400).json({
          success: false,
          message: "Fee structure for this course, semester, and academic year already exists",
        });
      }
      // initially hostel fees is 0
      const totalFee = breakdown.tuition  + breakdown.library;

      const structure = new FeeStructure({
        course,
        semester,
        academicYear,
        totalFee,
        breakdown,
      });

      await structure.save();

      return res.status(201).json({
        success: true,
        message: "Fee structure created successfully",
        data: structure,
      });
    } catch (error) {
      console.error("Error creating fee structure:", error);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  };

  /**
   * @desc Get all Fee Structures (filter optional)
   * @route GET /api/admin/fees/structures
   * @access Admin
   */
  static getStructures = async (req, res) => {
    try {
      const { course, semester, academicYear } = req.query;
      const filter = {};

      if (course) filter.course = course;
      if (semester) filter.semester = semester;
      if (academicYear) filter.academicYear = academicYear;

      const structures = await FeeStructure.find(filter).sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: structures.length,
        data: structures,
      });
    } catch (error) {
      console.error("Error fetching fee structures:", error);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  };

  /**
   * @desc Update a Fee Structure
   * @route PUT /api/admin/fees/structures/:id
   * @access Admin
   */
  static updateStructure = async (req, res) => {
    try {
      const { id } = req.params;
      const { course, semester, academicYear, breakdown } = req.body;

      const structure = await FeeStructure.findById(id);
      if (!structure) {
        return res.status(404).json({ success: false, message: "Fee structure not found" });
      }

      structure.course = course || structure.course;
      structure.semester = semester || structure.semester;
      structure.academicYear = academicYear || structure.academicYear;
      structure.breakdown = breakdown || structure.breakdown;

      structure.totalFee = structure.breakdown.tuition + structure.breakdown.hostel + structure.breakdown.library;

      await structure.save();

      return res.status(200).json({
        success: true,
        message: "Fee structure updated successfully",
        data: structure,
      });
    } catch (error) {
      console.error("Error updating fee structure:", error);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  };

  /**
   * @desc Delete a Fee Structure
   * @route DELETE /api/admin/fees/structures/:id
   * @access Admin
   */
  static deleteStructure = async (req, res) => {
    try {
      const { id } = req.params;
      const structure = await FeeStructure.findByIdAndDelete(id);

      if (!structure) {
        return res.status(404).json({ success: false, message: "Fee structure not found" });
      }

      return res.status(200).json({
        success: true,
        message: "Fee structure deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting fee structure:", error);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  };
}

export default AdminFeeStructureController;
