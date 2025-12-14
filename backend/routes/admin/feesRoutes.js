import express from "express";
// import authMiddleware from "../../middlewares/authMiddleware.js";
import AdminFeeStructureController from "../../controllers/admin/AdminFeeStructureController.js";
import Validators from "../../helpers/validators.js";
import AdminFeeAccountController from "../../controllers/admin/AdminFeeAccountController.js";
import AdminHostelFeeController from "../../controllers/admin/AdminHostelFeeController.js";
const router = express.Router();

// router api: /api/admin/fees/

// handle fees structure api - admission
router.post("/structures",Validators.feeStructureValidator,AdminFeeStructureController.createStructure)
router.get("/structures",AdminFeeStructureController.getStructures)
router.put("/structures/:id",Validators.updateFeeStructureValidator,AdminFeeStructureController.updateStructure)
router.delete("/structures/:id",AdminFeeStructureController.deleteStructure)


// handle feeAccount routes 
// 1.Get all student fee accounts (with optional search)
router.get("/accounts",AdminFeeAccountController.getFeeAccounts)
//  2. Get a single student's fee account and details -> view button
router.get("/accounts/:id",AdminFeeAccountController.getSingleFeeAccount)
// 3. Get aggregated financial statistics for the dashboard
router.get("/stats",AdminFeeAccountController.getDashboardStats)


// hostel fee structure
router.post("/structures/hostel",Validators.hostelFeeStructureValidator,AdminHostelFeeController.createStructure)
router.get("/structures/hostel",AdminHostelFeeController.getStructures)
router.put("/structures/hostel/:id",Validators.hostelFeeStructureValidator,AdminHostelFeeController.updateStructure)
router.delete("/structures/hostel/:id",AdminHostelFeeController.deleteStructure)

export default router; 
