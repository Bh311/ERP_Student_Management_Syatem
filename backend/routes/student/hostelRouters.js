import express from "express";
const router = express.Router();
import StudentHostelController from "../../controllers/student/StudentHostelController.js";


// Hostel routes -> /api/student/hostel


router.post('/apply',StudentHostelController.applyForHostel);
router.get('/status',StudentHostelController.getHostelStatus);

export default router;
