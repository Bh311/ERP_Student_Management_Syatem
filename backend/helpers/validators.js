import { body } from "express-validator";
import  {isValidCourseSemester}  from "./courseValidation.js";

class Validators {
  static admissionValidator = [
    body("fullname")
      .notEmpty()
      .withMessage("Full name is required"),

    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format"),

    body("phone")
      .notEmpty()
      .withMessage("Phone number is required")
      .isMobilePhone()
      .withMessage("Invalid phone number"),

    body("dob")
      .notEmpty()
      .withMessage("Date of birth is required")
      .isISO8601()
      .withMessage("Invalid date format (must be YYYY-MM-DD)"),

    body("gender")
      .notEmpty()
      .withMessage("Gender is required")
      .isIn(["Male", "Female", "Other"])
      .withMessage("Gender must be Male, Female, or Other"),

    body("address")
      .notEmpty()
      .withMessage("Address is required"),

    // Academics
    body("course").notEmpty().withMessage("Course is required"),

    body("semester")
      .notEmpty()
      .withMessage("Semester is required")
      .isInt({ min: 1 })
      .withMessage("Semester must be a positive number")
      .custom((semester, { req }) => {
        const course = req.body?.course;
        const check = isValidCourseSemester(course, semester);
        if (!check.valid) throw new Error(check.message);
        return true;
      }),

    body("tenthSchool")
      .notEmpty()
      .withMessage("10th School name is required"),

    body("tenthPercent")
      .notEmpty()
      .withMessage("10th percentage is required")
      .isFloat({ min: 0, max: 100 })
      .withMessage("10th percentage must be a number between 0 and 100"),

    body("twelfthSchool")
      .notEmpty()
      .withMessage("12th School name is required"),

    body("twelfthPercent")
      .notEmpty()
      .withMessage("12th percentage is required")
      .isFloat({ min: 0, max: 100 })
      .withMessage("12th percentage must be a number between 0 and 100"),

    // SGPA validation
    body("sgpa").custom((sgpa, { req }) => {
      const semester = req.body?.semester;
      if (semester > 1) {
        if (!Array.isArray(sgpa) || sgpa.length !== semester - 1) {
          throw new Error(
            `You must provide SGPA for ${semester - 1} semesters`
          );
        }
        if (!sgpa.every((s) =>  s >= 0 && s <= 10)) {
          throw new Error("Each SGPA must be between 0 and 10");
        }
      }
      return true;
    }),

    // Profile Picture
    body("profilePic").custom((value, { req }) => {
      if (!req.file) {
        throw new Error("Profile picture is required");
      }
      if (
        req.file.mimetype === "image/jpeg" ||
        req.file.mimetype === "image/jpg" ||
        req.file.mimetype === "image/png"
      ) {
        return true;
      }
      throw new Error("Only JPG and PNG images are allowed");
    }),

    // Status
    body("status")
      .optional()
      .isIn(["Applied", "Verified", "Enrolled", "Rejected"])
      .withMessage("Status must be Applied, Verified, Enrolled, or Rejected"),
  ];

  static feeStructureValidator = [
    body("course")
      .notEmpty()
      .withMessage("course is required")
      .isString()
      .withMessage("course must be a string"),

    body("semester")
      .notEmpty()
      .withMessage("Semester is required")
      .isInt({ min: 1 })
      .withMessage("Semester must be a positive number")
      .custom((semester, { req }) => {
        const course = req.body?.course;
        const check = isValidCourseSemester(course, semester);
        if (!check.valid) throw new Error(check.message);
        return true;
      }),

    body("academicYear")
      .matches(/^\d{4}-\d{2}$/)
      .withMessage("Academic year must be in format YYYY-YY (e.g., 2025-26)"),

    body("breakdown")
      .notEmpty()
      .withMessage("Breakdown is required")
      .isObject()
      .withMessage("Breakdown must be an object"),

    body("breakdown.tuition")
      .isFloat({ min: 0 })
      .withMessage("Tuition fee must be a non-negative number"),

    body("breakdown.library")
      .isFloat({ min: 0 })
      .withMessage("Library fee must be a non-negative number"),
  ];

  static updateFeeStructureValidator = [
    body("course")
      .optional()
      .isString()
      .withMessage("Course must be a string"),

    body("semester")
      .optional()
      .notEmpty()
      .withMessage("Semester is required")
      .isInt({ min: 1 })
      .withMessage("Semester must be a positive number")
      .custom((semester, { req }) => {
        const course = req.body?.course;
        const check = isValidCourseSemester(course, semester);
        if (!check.valid) throw new Error(check.message);
        return true;
      }),

    body("academicYear")
      .optional()
      .matches(/^\d{4}-\d{2}$/)
      .withMessage("Academic year must be in format YYYY-YY (e.g., 2025-26)"),

    body("breakdown")
      .optional()
      .isObject()
      .withMessage("Breakdown must be an object"),

    body("breakdown.tuition")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Tuition fee must be a non-negative number"),

    body("breakdown.hostel")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Hostel fee must be a non-negative number"),

    body("breakdown.library")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Library fee must be a non-negative number"),
  ];

  static hostelFeeStructureValidator = [
     body("academicYear")
      .matches(/^\d{4}-\d{2}$/)
      .withMessage("Academic year must be in format YYYY-YY (e.g., 2025-26)"),
    
    body("hostelFee")
      .isFloat({ min: 0 })
      .withMessage("Hostel fee must be a non-negative number"),
  ];

}
export default Validators;
