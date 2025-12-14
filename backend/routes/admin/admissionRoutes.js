import express from "express";
import AdminStudentAdmissionController from "../../controllers/admin/AdminStudentAdmissionController.js";
// import authMiddleware from "../../middlewares/authMiddleware.js";

const router = express.Router();

// student admission verification routes
router.put("/verify/:id",  AdminStudentAdmissionController.verifyStudent);
router.put("/enroll/:id",  AdminStudentAdmissionController.enrollStudent);
router.put("/reject/:id",  AdminStudentAdmissionController.rejectStudent);

// admission stats routes
router.get("/dashboard/stats", AdminStudentAdmissionController.getDashboardStats);

// Get all student applications with pagination, search, and status filter
router.get("/dashboard/applications", AdminStudentAdmissionController.getApplications);

// Get single student details i.e. view feature
router.get("/dashboard/applications/:id",  AdminStudentAdmissionController.getSingleApplication);

//Get Applications by Status (for filtering tabs)
// router.get("/dashboard/applications/status/:status", authMiddleware(["admin"]), AdminStudentAdmissionController.getApplicationsByStatus);

// Search students by name i.e search feature
// router.get("/dashboard/applications/search", authMiddleware(["admin"]), AdminStudentAdmissionController.searchApplications);

export default router;
