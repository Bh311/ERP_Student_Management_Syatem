import express from "express";
import handleExpiredReservations from './helpers/cronJobs.js';
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import studentRoutes from "./routes/student/studentRoutes.js";
import adminRoutes from "./routes/admin/adminRoutes.js";
dotenv.config();
const PORT = process.env.SERVER_PORT || 3000;
import cors from "cors";

import cookieParser from "cookie-parser";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend URL
    credentials: true, // allow cookies to be sent
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
// DB connect
connectDB();

// Routes
app.use("/api/student", studentRoutes);
app.use("/api/admin", adminRoutes);


// Start the cron job to handle expired hostel reservations
handleExpiredReservations();

// server start here
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
