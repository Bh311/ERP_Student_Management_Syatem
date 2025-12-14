import express from "express";
const router = express.Router();
import StudentFeeController from "../../controllers/student/StudentFeeController.js";
import authMiddleware from "../../middlewares/authMiddleware.js";


// fees routes -> /api/student/fees

router.get('/',StudentFeeController.getMyFees);
router.post('/pay',StudentFeeController.processPayment);
router.post('/verify',StudentFeeController.verifyPayment);
router.get('/receipt/:id/download',StudentFeeController.downloadReceipt);


export default router;
