import cron from 'node-cron';
import Admission from '../models/Admission.js';
import Hostel from '../models/Hostel.js';
import FeeAccount from '../models/FeeAccount.js';
import sendEmail from '../utils/sendEmail.js';
import { getReservationExpiredEmailContent } from '../utils/emailTemplates.js';

const handleExpiredReservations = async () => {
  try {
    console.log("Running cron job to check expired hostel reservations...");

    const expiredReservations = await Admission.find({
      "hostel.status": "Accepted",
      "hostel.reservationExpiryDate": { $lt: new Date() }
    });

    if (expiredReservations.length === 0) {
      console.log("No expired reservations.");
      return;
    }

    for (const student of expiredReservations) {
      const hostelName = student.hostel.hostelNumber; // 🔥 SAVE BEFORE RESETTING
      const roomNumber = student.hostel.roomNumber;

      // ---------------------------------------------------
      // ✔ FREE HOSTEL RESERVED COUNT + FLOOR OCCUPANCY
      // ---------------------------------------------------
      const hostel = await Hostel.findOne({ name: hostelName });

      if (hostel) {
        // Free reserved room
        if (hostel.reservedRooms > 0) hostel.reservedRooms -= 1;

        // Determine floor for the room being freed
        const floorNumber = Math.floor(roomNumber / 100); // 1,2,3
        const floorName = floorNumber === 1 ? "GF" : floorNumber === 2 ? "FF" : "SF";

        const floor = hostel.floors.find(f => f.name === floorName);
        if (floor && floor.occupiedRooms > 0) {
          floor.occupiedRooms -= 1;
        }

        await hostel.save();
      }

      // ---------------------------------------------------
      // ✔ REMOVE HOSTEL FEE FROM FEE ACCOUNT
      // ---------------------------------------------------
      const feeAccount = await FeeAccount.findOne({ student: student._id });

      if (feeAccount && feeAccount.breakdown.hostel > 0) {
        const hostelFee = feeAccount.breakdown.hostel;
        feeAccount.breakdown.hostel = 0;
        feeAccount.totalFee -= hostelFee;
        feeAccount.balance -= hostelFee;
        await feeAccount.save();
      }

      // ---------------------------------------------------
      // ✔ UPDATE STUDENT HOSTEL FIELDS
      // ---------------------------------------------------
      student.hostel.status = "Rejected";
      student.hostel.roomNumber = null;
      student.hostel.hostelNumber = null;
      student.hostel.reservationExpiryDate = null;
      student.hostel.isRequested = false;
      await student.save();

      // ---------------------------------------------------
      // ✔ SEND EMAIL (WITH ORIGINAL HOSTEL)
      // ---------------------------------------------------
      if (student.email) {
        const emailContent = getReservationExpiredEmailContent({
          fullname: student.fullname,
          hostelNumber: hostelName, // 🔥 correct
          roomNumber: roomNumber
        });

        await sendEmail(
          student.email,
          emailContent.subject,
          emailContent.html,
          emailContent.text
        );

        console.log(`Expiration email sent to: ${student.email}`);
      }

      console.log(`Reservation expired → ${student.fullname}`);
    }

    console.log("Cron job complete.");
  } catch (error) {
    console.error("Cron job error:", error);
  }
};

cron.schedule("0 * * * *", handleExpiredReservations);

export default handleExpiredReservations;
