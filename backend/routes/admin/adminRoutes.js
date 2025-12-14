import express from "express";
import AdminStudentAdmissionController from "../../controllers/admin/AdminStudentAdmissionController.js";
import admissionRoutes from "./admissionRoutes.js";
import feesRoutes from "./feesRoutes.js";
import hostelRoutes from "./hostelRoutes.js"
import authMiddleware from "../../middlewares/authMiddleware.js";
import AdminDashboardController from '../../controllers/admin/AdminDashboardController.js'

const router = express.Router();

// routes endpoint start -> /api/admin

// public routes
router.post("/register", AdminStudentAdmissionController.registerAdmin);
router.post("/login", AdminStudentAdmissionController.loginAdmin);

// admission routes
router.use('/admissions',authMiddleware(["admin"]), admissionRoutes)
router.get(
  "/dashboard/combined-stats",
  authMiddleware(["admin"]),
  AdminDashboardController.getCombinedStats
);
// fees routes
router.use("/fees",authMiddleware(["admin"]), feesRoutes)

// hostel routes 
router.use('/hostels',authMiddleware(["admin"]), hostelRoutes)


export default router;
