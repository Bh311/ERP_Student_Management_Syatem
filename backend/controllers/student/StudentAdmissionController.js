import Admission from "../../models/Admission.js";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import fs from "fs";
import getCurrentAcademicYear from "../../helpers/getCurrentAcademicYear.js";
import cloudinary from "../../config/cloudinaryConfig.js";
import { getAdmissionAppliedEmailContent } from "../../utils/emailTemplates.js";
import sendEmail from "../../utils/sendEmail.js";

class StudentController {
  // Apply for Admission
  static applyAdmission = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        if (req.file) {
          fs.unlinkSync( req.file.path);
        }
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          error: errors.array(),
        });
      }

      const {
        fullname,
        email,
        phone,
        dob,
        gender,
        address,
        status,
        course,
        semester,
        sgpa,
        tenthSchool,
        tenthPercent,
        twelfthSchool,
        twelfthPercent,
        isRequested,
      } = req.body;

      const academicYear = getCurrentAcademicYear();

      // Check for existing application
      const existing = await Admission.findOne({ email });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Email already registered for admission",
        });
      }

      // Prepare SGPA array converting to numbers
      const sgpaArray =
        semester > 1
          ? Array.isArray(sgpa)
            ? sgpa.map(Number)
            : [Number(sgpa)]
          : [];

      console.log(req.file);

      // uploading the profile image to cloudinary

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "ERP_Project",
      }); 

      // remove local temp file
      fs.unlinkSync(req.file.path);

      const newAdmission = new Admission({
        fullname,
        email,
        phone,
        dob,
        gender,
        address,
        status,
        academics: {
          course,
          semester: Number(semester) || 1,
          sgpa: sgpaArray,
          tenthSchool,
          tenthPercent: Number(tenthPercent),
          twelfthSchool,
          twelfthPercent: Number(twelfthPercent),
          academicYear,
        },

        profilePic: {
          public_id: result.public_id,
          url:result.secure_url
        },
        // Add the new hostel data
        hostel: {
            isRequested: isRequested === 'true', // Convert string to boolean
            status: isRequested === 'true' ? 'Applied' : null,
        },
      });

      await newAdmission.save();

      // send email to student on successful application
      const studentDetails = {
        fullname: newAdmission.fullname,
        studentID: newAdmission.studentID,
      };
      console.log("mail is working")
      const emailContent = getAdmissionAppliedEmailContent(studentDetails);
      await sendEmail(newAdmission.email, emailContent.subject, emailContent.html, emailContent.text);
      return res.status(201).json({
        success: true,
        message: "Application submitted successfully",
        data: newAdmission,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error submitting application",
        error: error.message,
      });
    }
  };

  // Student Login
  static studentLogin = async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email, role: "student" });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Student not found",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid password",
        });
      }

      const token = jwt.sign(
        { id: user._id, role: "student", linkedStudent: user.linkedStudent },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );

      // set token in httpOnly cookie
      res.cookie("token", token, {
        httpOnly: true, // JS on client cannot access
        secure: false, // true if using HTTPS in production
        sameSite: "strict",
        maxAge: 2 * 60 * 60 * 1000, // 2 hours
      });

      return res.json({
        success: true,
        message: "Login successful",
        data: {
          studentId: user.linkedStudent,
          email: user.email,
        },
        token,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error during login",
        error: error.message,
      });
    }
  }; 
}

export default StudentController;
