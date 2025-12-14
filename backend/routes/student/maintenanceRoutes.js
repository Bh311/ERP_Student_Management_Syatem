import express from "express";
import StudentMaintenanceController from "../../controllers/student/StudentMaintenanceController.js";

const router = express.Router();


router.post("/request", StudentMaintenanceController.createRequest);
router.get("/list", StudentMaintenanceController.getMyRequests);

export default router;
