import express from "express";
import StudentDashboardController from "../../controllers/student/StudentDashboardController.js";

const router = express.Router();

// GET /api/student/dashboard
router.get("/", StudentDashboardController.getDashboardData);

export default router;
