import Admission from "../../models/Admission.js";
import Hostel from "../../models/Hostel.js";
import FeeAccount from "../../models/FeeAccount.js";
import HostelFeeStructure from "../../models/HostelFeeStructure.js"; // This will be used to get the hostel fee
import { getHostelApprovedEmailContent, getHostelRejectionEmailContent } from "../../utils/emailTemplates.js";
import sendEmail from "../../utils/sendEmail.js";

// A helper function to create a reservation expiry date
const getExpiryDate = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

class AdminHostelController {
  /**
   * @desc Create both boys' and girls' hostels in the database
   * @route POST /api/admin/hostels/create
   * @access Admin
   */
  static createHostels = async (req, res) => {
    try {
      // Check if hostels already exist
      const existingHostels = await Hostel.find();
      if (existingHostels.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Hostels have already been created.",
        });
      }

      // Create the two hostel documents
      const newHostels = await Hostel.insertMany([
        {
          name: "H1",
          gender: "Boys",
          totalRooms: 150,
          occupiedRooms: 0,
        },
        {
          name: "H2",
          gender: "Girls",
          totalRooms: 150,
          occupiedRooms: 0,
        },
      ]);

      return res.status(201).json({
        success: true,
        message: "Hostels created successfully",
        data: newHostels,
      });
    } catch (error) {
      console.error("Error creating hostels:", error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
        error: error.message,
      });
    }
  };

  /**
   * @desc Get all pending hostel requests with pagination and search
   * @route GET /api/admin/hostels/requests?page=1&limit=10&name=john
   * @access Admin
   */
  static getAppliedHostelRequests = async (req, res) => {
    try {
      const { name, page = 1, limit = 10 } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      let filter = {
        "hostel.isRequested": true,
        "hostel.status": "Applied",
      };

      if (name) {
        filter.fullname = { $regex: name, $options: "i" };
      }

      const totalDocuments = await Admission.countDocuments(filter);

      const requests = await Admission.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      if (!requests || requests.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No pending hostel requests found.",
        });
      }

      return res.status(200).json({
        success: true,
        count: requests.length,
        totalDocuments,
        data: requests,
      });
    } catch (error) {
      console.error("Error fetching hostel requests:", error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
        error: error.message,
      });
    }
  };

  /**
   * @desc Accept a student's hostel request and create a temporary reservation
   * @route PUT /api/admin/hostels/accept/:id
   * @access Admin
   */
 static acceptHostelRequest = async (req, res) => {
  try {
    const studentId = req.params.id;

    const student = await Admission.findById(studentId);
    if (!student || student.hostel.status !== "Applied") {
      return res.status(400).json({
        success: false,
        message: "Hostel request not found or already processed.",
      });
    }

    // Determine hostel based on gender
    const hostelName = student.gender === "Male" ? "H1" : "H2";
    const hostel = await Hostel.findOne({ name: hostelName });

    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: `Hostel ${hostelName} not found`,
      });
    }

    // Check availability (reserved + occupied < totalRooms)
    const totalReservedAndOccupied = hostel.occupiedRooms + hostel.reservedRooms;
    if (totalReservedAndOccupied >= hostel.totalRooms) {
      return res.status(400).json({
        success: false,
        message: `No rooms available in ${hostelName}. Hostel is full.`,
      });
    }

    // -------------------------------------------
    // ✔ Assign Room Number (Based on Floors Logic)
    // -------------------------------------------

    const roomIndex = totalReservedAndOccupied; // 0-based index
    const floors = hostel.floors.length;        // Should be 3 (GF, FF, SF)
    const roomsPerFloor = Math.floor(hostel.totalRooms / floors); // 150/3 = 50

    let floorName = "GF";
    let floorNumber = 1;

    if (roomIndex < roomsPerFloor) {
      floorName = "GF";
      floorNumber = 1;
    } else if (roomIndex < roomsPerFloor * 2) {
      floorName = "FF";
      floorNumber = 2;
    } else {
      floorName = "SF";
      floorNumber = 3;
    }

    const roomNumberWithinFloor = (roomIndex % roomsPerFloor) + 1; // 1–50
    const assignedRoomNumber = floorNumber * 100 + roomNumberWithinFloor;

    // Update floor occupancy
    const floor = hostel.floors.find(f => f.name === floorName);
    floor.occupiedRooms += 1;

    // Update hostel reserved count
    hostel.reservedRooms += 1;
    await hostel.save();

    // -------------------------------------------
    // ✔ Add Hostel Fee to FeeAccount
    // -------------------------------------------

    const hostelFeeStructure = await HostelFeeStructure.findOne({
      academicYear: student.academics.academicYear,
    });

    if (!hostelFeeStructure) {
      return res.status(404).json({
        success: false,
        message: "Hostel fee structure not found for this academic year.",
      });
    }

    const feeAccount = await FeeAccount.findOne({ student: studentId });
    if (feeAccount) {
      const hostelFee = hostelFeeStructure.hostelFee;
      feeAccount.breakdown.hostel = hostelFee;
      feeAccount.totalFee += hostelFee;
      feeAccount.balance += hostelFee;
      await feeAccount.save();
    }

    // -------------------------------------------
    // ✔ Update Student Record
    // -------------------------------------------

    student.hostel.status = "Accepted";
    student.hostel.hostelNumber = hostelName;
    student.hostel.roomNumber = assignedRoomNumber;
    student.hostel.reservationExpiryDate = getExpiryDate(3); // 3 days window
    await student.save();

    // -------------------------------------------
    // ✔ Send Email to Student
    // -------------------------------------------

    const emailContent = getHostelApprovedEmailContent({
      fullname: student.fullname,
      hostelNumber: hostelName,
      roomNumber: assignedRoomNumber,
      reservationExpiryDate: student.hostel.reservationExpiryDate,
    });

    await sendEmail(student.email, emailContent.subject, emailContent.html, emailContent.text);

    // Response
    return res.status(200).json({
      success: true,
      message: "Hostel room assigned successfully",
      data: {
        student,
        assignedRoom: assignedRoomNumber,
        hostel,
      },
    });

  } catch (error) {
    console.error("Error accepting hostel request:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};


  /**
   * @desc Reject a student's hostel request
   * @route PUT /api/admin/hostels/reject/:id
   * @access Admin
   */
  static rejectHostelRequest = async (req, res) => {
    try {
      const studentId = req.params.id;

      const student = await Admission.findById(studentId);
      if (!student || student.hostel.status !== "Applied") {
        return res.status(400).json({
          success: false,
          message: "Hostel request not found or cannot be rejected.",
        });
      }

      // Simply update the student's Admission document
      student.hostel.status = "Rejected";
      await student.save();

      // send email to student about rejection
      const emailContent = getHostelRejectionEmailContent({
         fullname: student.fullname,
      })

      await sendEmail(student.email, emailContent.subject, emailContent.html, emailContent.text);

      return res.status(200).json({
        success: true,
        message: "Hostel request rejected successfully.",
        data: student,
      });
    } catch (error) {
      console.error("Error rejecting hostel request:", error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
        error: error.message,
      });
    }
  };

 
/**
 * @desc Get all students whose hostel request is Accepted
 * @route GET /api/admin/hostels/accepted
 * @access Admin
 */
static getAcceptedHostelStudents = async (req, res) => {
  try {
    const acceptedStudents = await Admission.find(
      { "hostel.status": "Accepted" },
      {
        fullname: 1,
        email: 1,
        phone: 1,
        studentID: 1,
        academics: 1,
        "hostel.status": 1,
        "hostel.hostelNumber": 1,
        "hostel.roomNumber": 1,
        "hostel.reservationExpiryDate": 1,
      }
    ).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: acceptedStudents.length,
      data: acceptedStudents,
    });
  } catch (error) {
    console.error("Error fetching accepted hostel students:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

/**
 * @desc Get hostel block stats (H1, H2)
 * @route GET /api/admin/hostels/overview
 * @access Admin
 */
static getHostelOverview = async (req, res) => {
  try {
    const hostels = await Hostel.find();

    // Count students inside hostels
    const acceptedStudents = await Admission.find({
      "hostel.status": "Accepted"
    });

    const blocks = hostels.map(h => {
      // Count how many students belong to this hostel
      const bedsOccupied = acceptedStudents.filter(
        s => s.hostel.hostelNumber === h.name
      ).length;

      // Total beds = rooms * 2
      const totalBeds = h.totalRooms * 2;

      // roomsOccupied = number of rooms having at least 1 student
      const roomsOccupied = Math.ceil(bedsOccupied / 2); // 2 students per room

      // Occupancy %
      const occupancy = Math.round((bedsOccupied / totalBeds) * 100);

      return {
        name: h.name,
        gender: h.gender,
        floors: h.floors.length,
        roomsOccupied,
        totalRooms: h.totalRooms,
        bedsOccupied,
        totalBeds,
        occupancy,
        amenities:
          h.name === "H1"
            ? ["WiFi", "AC", "Laundry", "Common Room"]
            : ["WiFi", "Fan", "Laundry", "Study Hall"],
      };
    });

    return res.status(200).json({
      success: true,
      blocks
    });

  } catch (error) {
    console.error("Error fetching hostel overview:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

/**
 * @desc Get stats for hero section (capacity, occupancy, available rooms, allotted rooms)
 * @route GET /api/admin/hostels/stats
 * @access Admin
 */
static getHostelStats = async (req, res) => {
  try {
    const hostels = await Hostel.find();

    let totalRooms = 0;
    let reservedBeds = 0;   // students
    let occupiedRooms = 0;  // fully filled rooms

    for (const hostel of hostels) {
      totalRooms += hostel.totalRooms;
      reservedBeds += hostel.reservedRooms;
      occupiedRooms += hostel.occupiedRooms;
    }

    // beds per room = 2
    const halfFilledRooms = Math.ceil(reservedBeds / 2);

    const availableRooms = totalRooms - occupiedRooms - halfFilledRooms;

    const totalBeds = totalRooms * 2;
    const filledBeds = (occupiedRooms * 2) + reservedBeds;

    const occupancyPercent = Math.round((filledBeds / totalBeds) * 100);

    return res.status(200).json({
      success: true,
      data: {
        totalCapacity: totalBeds,
        currentOccupancy: filledBeds,
        currentOccupancyPercent: occupancyPercent,
        availableRooms,
        allotedRooms: occupiedRooms + halfFilledRooms,
      }
    });

  } catch (error) {
    console.error("Stats Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};




}
export default AdminHostelController;
