import Admission from "../../models/Admission.js";
import FeeAccount from "../../models/FeeAccount.js";

class AdminDashboardController {
 static getCombinedStats = async (req, res) => {
  try {
    // 1️⃣ Admission stats
    const pendingReview = await Admission.countDocuments({
      status: "Applied"
    });

    // 2️⃣ Fees stats (Total Collected)
    const feeStats = await FeeAccount.aggregate([
      {
        $group: {
          _id: null,
          totalCollected: { $sum: "$paid" }
        }
      }
    ]);

    const totalCollected =
      feeStats.length > 0 ? feeStats[0].totalCollected : 0;

    // ⭐ 3️⃣ Students who have NOT paid fees
    const unpaidStudents = await FeeAccount.countDocuments({
      balance: { $gt: 0 }
    });

    // ⭐ 4️⃣ Hostel Occupancy Stats
    let hostelStats = {
      totalCapacity: 0,
      currentOccupancy: 0,
      currentOccupancyPercent: 0,
      availableRooms: 0,
      allottedRooms: 0
    };

    try {
      const hostelRes = await axios.get(
        "http://localhost:3000/api/admin/hostels/stats"
      );

      if (hostelRes.data.success) {
        hostelStats = hostelRes.data.data;
      }
    } catch (err) {
      console.error("Hostel Stats Fetch Error:", err.message);
    }

    // ✅ FINAL RESPONSE
    return res.status(200).json({
      success: true,
      message: "Combined stats fetched successfully",
      data: {
        pendingReview,
        totalCollected,
        unpaidStudents, // ⭐ ADDED
        hostel: hostelStats
      }
    });

  } catch (error) {
    console.error("Error fetching combined stats:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};


}

export default AdminDashboardController;
