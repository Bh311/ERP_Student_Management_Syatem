import FeeAccount from "../../models/FeeAccount.js";
import Admission from "../../models/Admission.js";

class AdminFeeAccountController {
  /**
   * @desc Get all student fee accounts with pagination, search, and status filter
   * @route GET /api/admin/fees/accounts?page=1&limit=10&name=john&status=Overdue
   * @access Admin
   */
  static getFeeAccounts = async (req, res) => {
    try {
      const { name, page = 1, limit = 10, status } = req.query;
      let filter = {};

      // Calculate skip value for pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);

      if (name) {
        const students = await Admission.find({
          fullname: { $regex: name, $options: "i" },
        }).select("_id");

        const studentIds = students.map((student) => student._id);
        filter.student = { $in: studentIds };
      }

      // Add status filter based on the query parameter
      if (status) {
        if (status.toLowerCase() === "overdue") {
          filter.balance = { $gt: 0 };
          filter.dueDate = { $lt: new Date() };
        } else if (status.toLowerCase() === "pending") {
          // 'Pending' in your UI corresponds to any balance > 0
          filter.balance = { $gt: 0 };
        } else {
          // For other statuses like 'Paid' or 'Unpaid'
          filter.status = status;
        }
      }

      const totalDocuments = await FeeAccount.countDocuments(filter);

      const feeAccounts = await FeeAccount.find(filter)
        .populate({
          path: "student",
          model: Admission,
          select: "fullname studentID profilePic academics.course academics.semester",
        })
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

      if (!feeAccounts || feeAccounts.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No fee accounts found.",
        });
      }

      return res.status(200).json({
        success: true,
        count: feeAccounts.length,
        totalDocuments,
        data: feeAccounts,
      });
    } catch (error) {
      console.error("Error fetching fee accounts:", error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
        error: error.message,
      });
    }
  };

  /**
   * @desc Get a single student's fee account and details
   * @route GET /api/admin/fees/accounts/:id
   * @access Admin
   */
  static getSingleFeeAccount = async (req, res) => {
    try {
      const { id } = req.params;

      // Find the fee account and populate the student's personal details
      const feeAccount = await FeeAccount.findOne({ student: id }).populate({
        path: "student",
        model: Admission,
        select: "fullname studentID profilePic academics", // Populate all required fields
      });

      if (!feeAccount) {
        return res.status(404).json({
          success: false,
          message: "Fee account not found for this student.",
        });
      }

      // The `transactions` array is an embedded document and doesn't need to be populated
      // All the necessary information is already in the `feeAccount` document.

      return res.status(200).json({
        success: true,
        message: "Fee account fetched successfully.",
        data: feeAccount,
      });
    } catch (error) {
      console.error("Error fetching single fee account:", error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
        error: error.message,
      });
    }
  };

  /**
   * @desc Get aggregated financial statistics for the dashboard
   * @route GET /api/admin/fees/stats
   * @access Admin
   */
  static getDashboardStats = async (req, res) => {
    try {
      // 1. Use aggregation to calculate total collected and total pending amounts
      const totalStats = await FeeAccount.aggregate([
        {
          $group: {
            _id: null,
            totalCollected: { $sum: "$paid" },
            totalPending: { $sum: "$balance" },
          },
        },
      ]);

      const { totalCollected = 0, totalPending = 0 } =
        totalStats.length > 0 ? totalStats[0] : {};

      // 2. Count overdue accounts
      const overdueCount = await FeeAccount.countDocuments({
        balance: { $gt: 0 },
        dueDate: { $lt: new Date() },
      });

      // 3. Calculate collection rate
      const totalDue = totalCollected + totalPending;
      const collectionRate =
        totalDue > 0 ? (totalCollected / totalDue) * 100 : 0;

      return res.status(200).json({
        success: true,
        message: "Dashboard stats fetched successfully",
        data: {
          totalCollected,
          totalPending,
          collectionRate: parseFloat(collectionRate.toFixed(2)), // Format to 2 decimal places
          overdue: overdueCount,
        },
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
        error: error.message,
      });
    }
  };
}

export default AdminFeeAccountController;
