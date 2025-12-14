import express from "express";
import AdminHostelController from "../../controllers/admin/AdminHostelController.js";

// import authMiddleware from "../../middlewares/authMiddleware.js";

const router = express.Router();

// routes endpoint start -> /api/admin/hostels

// Create both boys' and girls' hostels in the database
router.post("/create" ,AdminHostelController.createHostels);

// Get all pending hostel requests with pagination and search
router.get("/requests", AdminHostelController.getAppliedHostelRequests);

// Accept a student's hostel request and create a temporary reservation
router.put("/accept/:id" , AdminHostelController.acceptHostelRequest);

// Reject a student's hostel request
router.put("/reject/:id", AdminHostelController.rejectHostelRequest);

router.get("/accepted", AdminHostelController.getAcceptedHostelStudents);


router.get("/overview", AdminHostelController.getHostelOverview);

router.get("/stats", AdminHostelController.getHostelStats);


export default router;
