import HostelFeeStructure from "../../models/HostelFeeStructure.js";
import { validationResult } from "express-validator";

class AdminHostelFeeController {
  /**
   * @desc Create a new Hostel Fee Structure
   * @route POST /api/admin/hostel-fees/structures
   * @access Admin
   */
  static createStructure = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { academicYear, hostelFee } = req.body;

      // Check if a fee structure for this academic year already exists
      const exists = await HostelFeeStructure.findOne({ academicYear });
      if (exists) {
        return res.status(400).json({
          success: false,
          message: `Hostel fee structure for academic year ${academicYear} already exists`,
        });
      }

      const structure = new HostelFeeStructure({
        academicYear,
        hostelFee,
      });

      await structure.save();

      return res.status(201).json({
        success: true,
        message: "Hostel fee structure created successfully",
        data: structure,
      });
    } catch (error) {
      console.error("Error creating hostel fee structure:", error);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  };

  /**
   * @desc Get all Hostel Fee Structures (filter optional)
   * @route GET /api/admin/hostel-fees/structures
   * @access Admin
   */
  static getStructures = async (req, res) => {
    try {
      const { academicYear } = req.query;
      const filter = {};

      if (academicYear) filter.academicYear = academicYear;

      const structures = await HostelFeeStructure.find(filter).sort({
        createdAt: -1,
      });

      return res.status(200).json({
        success: true,
        count: structures.length,
        data: structures,
      });
    } catch (error) {
      console.error("Error fetching hostel fee structures:", error);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  };

  /**
   * @desc Update a Hostel Fee Structure
   * @route PUT /api/admin/hostel-fees/structures/:id
   * @access Admin
   */
  static updateStructure = async (req, res) => {
    try {
      const { id } = req.params;
      const { academicYear, hostelFee } = req.body;

      const structure = await HostelFeeStructure.findById(id);
      if (!structure) {
        return res
          .status(404)
          .json({ success: false, message: "Hostel fee structure not found" });
      }

      structure.academicYear = academicYear || structure.academicYear;
      structure.hostelFee = hostelFee || structure.hostelFee;

      await structure.save();

      return res.status(200).json({
        success: true,
        message: "Hostel fee structure updated successfully",
        data: structure,
      });
    } catch (error) {
      console.error("Error updating hostel fee structure:", error);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  };

  /**
   * @desc Delete a Hostel Fee Structure
   * @route DELETE /api/admin/hostel-fees/structures/:id
   * @access Admin
   */
  static deleteStructure = async (req, res) => {
    try {
      const { id } = req.params;
      const structure = await HostelFeeStructure.findByIdAndDelete(id);

      if (!structure) {
        return res
          .status(404)
          .json({ success: false, message: "Hostel fee structure not found" });
      }

      return res.status(200).json({
        success: true,
        message: "Hostel fee structure deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting hostel fee structure:", error);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  };
}

export default AdminHostelFeeController;