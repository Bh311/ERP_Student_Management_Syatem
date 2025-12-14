import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admission from "../../models/Admission.js";
import User from "../../models/User.js";
import sendEmail from "../../utils/sendEmail.js";
import FeeAccount from "../../models/FeeAccount.js";
import FeeStructure from "../../models/FeeStructure.js";
import { getAdmissionRejectionEmailContent, getWelcomeEmailContent } from "../../utils/emailTemplates.js";

class AdminStudentAdmissionController {
  static registerAdmin = async (req, res) => {
    try {
      const { email, password } = req.body;

      // Allow only one admin account
      const existingAdmin = await User.findOne({ role: "admin" });
      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          message: "You can't register more than one admin",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create admin
      const admin = new User({
        email,
        password: hashedPassword,
        role: "admin",
      });

      await admin.save();

      res.status(201).json({
        success: true,
        message: "Admin registered successfully",
        data: admin,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error registering admin",
        error: error.message,
      });
    }
  };

  static loginAdmin = async (req, res) => {
    try {
      const { email, password } = req.body;
      const admin = await User.findOne({ email, role: "admin" });

      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin not found",
        });
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: admin._id, role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      // set token in httpOnly cookie
      res.cookie("token", token, {
        httpOnly: true, // JS on client cannot access
        secure: false, // true if using HTTPS in production
        sameSite: "strict",
        maxAge: 2 * 60 * 60 * 1000, // 2 hours
      });

      res.json({
        success: true,
        message: "Login successful",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error logging in",
        error: error.message,
      });
    }
  };

  static verifyStudent = async (req, res) => {
    try {
      const student = await Admission.findById(req.params.id);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found",
        });
      }

      // Allow verification ONLY if student is in 'Applied' state
      if (student.status !== "Applied") {
        return res.status(400).json({
          success: false,
          message: `Only 'Applied' students can be verified. Current status is '${student.status}'.`,
          data: student,
        });
      }

      // Update status to Verified
      student.status = "Verified";
      await student.save();

      res.json({
        success: true,
        message: "Student verified successfully",
        data: student,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error verifying student",
        error: error.message,
      });
    }
  };

  static enrollStudent = async (req, res) => {
    try {
      const student = await Admission.findById(req.params.id);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found",
        });
      }

      // Check if already enrolled
      if (student.status === "Enrolled") {
        return res.status(400).json({
          success: false,
          message: "Student is already enrolled",
          data: student,
        });
      }

      // Must be verified before enrolling
      if (student.status !== "Verified") {
        return res.status(400).json({
          success: false,
          message: "Student must be verified before enrolling",
          data: student,
        });
      }

      // Create fee account
      //  1. Find the Fee Structure for the student's course and semester

      const feeStructure = await FeeStructure.findOne({
        course: student.academics.course,
        semester: student.academics.semester,
        academicYear: student.academics.academicYear,
      });

      // Handle the case where no fee structure is found
      if (!feeStructure) {
        return res.status(404).json({
          success: false,
          message: `Fee structure for ${student.academics.course} semester ${student.academics.semester} in academic year ${student.academics.academicYear} not found.`,
        });
      }

      // Update status to Enrolled
      student.status = "Enrolled";
      await student.save();

      // 2. Create the Fee Account for the student

      // to set the due date
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      const newFeeAccount = new FeeAccount({
        student: student._id,
        dueDate: thirtyDaysFromNow,
        // Using data from the found fee structure
        totalFee: feeStructure.totalFee,
        paid: 0,
        balance: feeStructure.totalFee,
        breakdown: feeStructure.breakdown,
      });
      await newFeeAccount.save();

      // Generate random password
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      // Create user account
      const newUser = new User({
        email: student.email,
        password: hashedPassword,
        role: "student",
        linkedStudent: student._id,
      });

      await newUser.save();

      // Send email with credentials

      const studentDetails = {
        studentID: student.studentID,
        email: student.email,
        password: randomPassword,
      };

      const emailContent = getWelcomeEmailContent(studentDetails);

      await sendEmail(
        student.email,
        emailContent.subject,
        emailContent.html, // Use the HTML property
        emailContent.text // Optional: Use the text property as a fallback
      );

      // await sendEmail(
      //   student.email,
      //   "Welcome to ERP",
      //   `Your Student ID: ${student.studentID}\nEmail: ${student.email}\nPassword: ${randomPassword}`
      // );

      console.log("Email sent to:", student.email);

      res.json({
        success: true,
        message: "Student enrolled and credentials sent",
        data: { student, credentialsSent: true },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error enrolling student",
        error: error.message,
      });
    }
  };

  static rejectStudent = async (req, res) => {
    try {
      // Find student by ID
      const student = await Admission.findById(req.params.id);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found",
        });
      }

      // Prevent rejection if already enrolled
      if (student.status === "Enrolled") {
        return res.status(400).json({
          success: false,
          message: "Cannot reject an enrolled student",
          data: student,
        });
      }

      // Prevent duplicate rejection
      if (student.status === "Rejected") {
        return res.status(400).json({
          success: false,
          message: "Student is already rejected",
          data: student,
        });
      }

      // Allow rejection even if verified (business choice)
      if (student.status === "Verified") {
        console.log(`Rejecting verified student: ${student.email}`);
      }

      // Update status
      student.status = "Rejected";
      await student.save();

      // Send rejection email if email exists
      if (student.email) {
        const emailContent = getAdmissionRejectionEmailContent({
          fullname: student.fullname,
        });

        await sendEmail(
          student.email,
          emailContent.subject,
          emailContent.html, // Use the HTML body from the template
          emailContent.text   // Use the text body as a fallback
        );
        console.log("Email sent to:", student.email);
      } else {
        console.log("⚠️ No email found for student, skipping email sending");
      }

      res.json({
        success: true,
        message: "Student application rejected",
        data: student,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error rejecting student",
        error: error.message,
      });
    }
  };

  static getDashboardStats = async (req, res) => {
    try {
      const applied = await Admission.countDocuments({ status: "Applied" });
      const verified = await Admission.countDocuments({ status: "Verified" });
      const enrolled = await Admission.countDocuments({ status: "Enrolled" });
      const rejected = await Admission.countDocuments({ status: "Rejected" });

      const total = applied + verified + enrolled + rejected;
      const pendingReview = applied; // alias for clarity

      res.json({
        success: true,
        message: "Dashboard stats fetched successfully",
        data: {
          applied,
          verified,
          enrolled,
          rejected,
          pendingReview,
          total,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching dashboard stats",
        error: error.message,
      });
    }
  };

  /**
   * @desc Get all student applications with pagination, search, and status filter
   * @route GET /api/admin/applications?page=1&limit=10&name=john&status=Enrolled
   * @access Admin
   */
  static getApplications = async (req, res) => {
    try {
      // Get query parameters for pagination, search, and status
      const { name, page = 1, limit = 10, status } = req.query;

      // Calculate the number of documents to skip
      const skip = (parseInt(page) - 1) * parseInt(limit);

      let filter = {};

      if (name) {
        // Add name search to the filter
        filter.fullname = { $regex: name, $options: "i" };
      }

      if (status) {
        // Add status filter
        filter.status = status;
      }

      // Get the total count of documents matching the filter
      const totalDocuments = await Admission.countDocuments(filter);

      const applications = await Admission.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      if (!applications || applications.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No applications found.",
        });
      }

      res.json({
        success: true,
        message: "Applications fetched successfully",
        count: applications.length,
        totalDocuments,
        data: applications,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching applications",
        error: error.message,
      });
    }
  };

  // static getApplicationsByStatus = async (req, res) => {
  //   try {
  //     const { status } = req.params;
  //     const validStatuses = ["Applied", "Verified", "Enrolled", "Rejected"];

  //     if (!validStatuses.includes(status)) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "Invalid status",
  //       });
  //     }

  //     const applications = await Admission.find({ status }).sort({
  //       createdAt: -1,
  //     });

  //     res.json({
  //       success: true,
  //       message: `Applications with status '${status}' fetched successfully`,
  //       data: applications,
  //     });
  //   } catch (error) {
  //     res.status(500).json({
  //       success: false,
  //       message: "Error fetching applications by status",
  //       error: error.message,
  //     });
  //   }
  // };

  // ✅ Get single student by ID

  static getSingleApplication = async (req, res) => {
    try {
      const student = await Admission.findById(req.params.id);

      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found",
        });
      }

      res.json({
        success: true,
        message: "Student fetched successfully",
        data: student,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching student",
        error: error.message,
      });
    }
  };

  // ✅ Search students by fullname
  // static searchApplications = async (req, res) => {
  //   try {
  //     const { name } = req.query;

  //     if (!name) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "Please provide a search query (name)",
  //       });
  //     }

  //     // Case-insensitive search using regex
  //     const students = await Admission.find({
  //       fullname: { $regex: name, $options: "i" },
  //     });

  //     res.json({
  //       success: true,
  //       message: "Search results fetched",
  //       results: students,
  //     });
  //   } catch (error) {
  //     res.status(500).json({
  //       success: false,
  //       message: "Error searching students",
  //       error: error.message,
  //     });
  //   }
  // };
}
export default AdminStudentAdmissionController;
