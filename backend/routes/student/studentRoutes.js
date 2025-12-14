import express from "express";
import StudentController from "../../controllers/student/StudentAdmissionController.js";
import upload from "../../middlewares/uploadImage.js";
import Validators from "../../helpers/validators.js";
import feesRouters from "./feesRoutes.js";
import authMiddleware from "../../middlewares/authMiddleware.js";
import hostelRouters from "./hostelRouters.js";
import maintenance from './maintenanceRoutes.js';
import dashboardRoutes from "./dashboardRoutes.js";

const router = express.Router();

// -> /api/student
router.post("/apply", upload.single("profilePic"), Validators.admissionValidator, StudentController.applyAdmission);
router.post("/login", StudentController.studentLogin);

// fees routes -> /api/student/fees
router.use('/fees', authMiddleware(["student"]), feesRouters);

// hostel routes -> /api/student/hostel
router.use('/hostel', authMiddleware(["student"]), hostelRouters);

// maintenance routes -> /api/student/maintenance
router.use('/maintenance', authMiddleware(["student"]), maintenance);



// dashboard route
router.use("/dashboard", authMiddleware(["student"]), dashboardRoutes);


export default router;
