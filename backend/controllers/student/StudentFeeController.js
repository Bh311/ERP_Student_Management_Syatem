import FeeAccount from "../../models/FeeAccount.js";
import Admission from "../../models/Admission.js";
import Receipt from "../../models/Receipt.js";
import { createOrder, fetchOrderById } from "../../services/razorpayService.js";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import Hostel from "../../models/Hostel.js";
import fs from "fs";
import { getHostelAllottedEmailContent, getPaymentDoneEmailContent } from "../../utils/emailTemplates.js";
import sendEmail from "../../utils/sendEmail.js";

const getNextAvailableRoom = (hostel) => {
  const floorNames = ["GF", "FF", "SF"];
  const roomsPerFloor = 50;
  for (const floorName of floorNames) {
    const floor = hostel.floors.find((f) => f.name === floorName);
    if (floor.occupiedRooms < roomsPerFloor) {
      const roomNumber = floor.occupiedRooms + 1;
      return `${floorName}-${roomNumber}`;
    }
  }
  return null; // No rooms available
};

class StudentFeeController {
  /**
   * @desc Get a student's fee details
   * @route GET /api/student/fees
   * @access Student
   */
  static getMyFees = async (req, res) => {
    try {
      // Use a more descriptive variable name
      const student = req.user.linkedStudent;

      // 1. Find by ID directly
      // 2. Populate the 'student' field to get linked data
      const feeAccount = await FeeAccount.findOne({ student }).populate({
        path: "student",
        model: Admission,
      });

      if (!feeAccount) {
        // Use 404 Not Found as the resource doesn't exist
        return res.status(404).json({
          success: false,
          message: "Fee account not found for this student.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Fee account fetched successfully.",
        data: feeAccount,
      });
    } catch (error) {
      console.error("Error in getMyFees:", error); // Use console.error for errors
      // Use 500 Server Error for internal issues
      return res.status(500).json({
        success: false,
        message: "Server Error",
        error: error.message,
      });
    }
  };

  /**
   * @desc process the payment and add order on razorpay
   * @route POST /api/student/fees/pay
   * @access Student
   */

  static processPayment = async (req, res) => {
    try {
      const student = req.user.linkedStudent;
      const { amount, feeType } = req.body;

      console.log(amount, feeType)
      const feeAccount = await FeeAccount.findOne({ student });

      if (!feeAccount) {
        // Use 404 Not Found as the resource doesn't exist
        return res.status(404).json({
          success: false,
          message: "Fee account not found for this student.",
        });
      }

      // Validate feeType and amount
      const feeTypeAmount = feeAccount.breakdown[feeType];

      if (
        feeTypeAmount === undefined ||
        amount <= 0 ||
        amount !== feeTypeAmount
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid fee type or amount provided.",
        });
      }

      if (feeTypeAmount === 0) {
        return res.status(400).json({
          success: false,
          message: `${feeType} fee is already paid in full.`,
        });
      }

      // --- Razorpay Integration starts here ---
      // Create an order with Razorpay

      const orderOptions = {
        amount: amount * 100,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: {
          student,
          feeType,
        },
      };

      const razorpayOrder = await createOrder(orderOptions);
      console.log(razorpayOrder);
      return res.status(200).json({
        success: true,
        message: "Razorpay order created successfully",
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        notes: razorpayOrder.notes,
      });
    } catch (error) {
      console.error("Error in processPayment:", error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
        error: error.message,
      });
    }
  };

  /**
   * @desc Verify a successful Razorpay payment and update the database
   * @route POST /api/student/fees/verify
   * @access Student
   */

  static verifyPayment = async (req, res) => {
    try {
      const { payment_id, order_id, razorpay_signature } = req.body;

      // 1. Verify the payment signature
      const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
      const generated_signature = crypto
        .createHmac("sha256", razorpayKeySecret)
        .update(`${order_id}|${payment_id}`)
        .digest("hex");

      if (generated_signature !== razorpay_signature) {
        console.error("Payment verification failed. Signatures do not match.");
        return res.status(400).json({
          success: false,
          message: "Payment verification failed. Please try again.",
        });
      }

      // 2. Fetch the order from Razorpay API

      // This is the most secure way to get the amount and notes
      // to ensure no one tampered with the frontend data.
      // here student -> admission form id
      const razorpayOrder = await fetchOrderById(order_id);
      const { student: studentIdFromNotes, feeType: feeTypeFromNotes } =
        razorpayOrder.notes;
      const amountFromRazorpay = razorpayOrder.amount / 100;

      // 3. Extra Security Check: Ensure the payment belongs to the logged-in student
      const loggedInStudentId = req.user.linkedStudent;
      if (studentIdFromNotes !== loggedInStudentId) {
        console.error(
          `Attempted payment for student ${studentIdFromNotes} by user ${loggedInStudentId}`
        );
        return res.status(403).json({
          success: false,
          message: "Access denied. Payment does not belong to this account.",
        });
      }

      // 4. Find the FeeAccount and update the database
      const feeAccount = await FeeAccount.findOne({
        student: loggedInStudentId,
      });

      if (!feeAccount) {
        return res.status(404).json({
          success: false,
          message: "Fee account not found for this student.",
        });
      }

      // Perform all database updates if the signature is valid
      feeAccount.paid += amountFromRazorpay;
      feeAccount.balance -= amountFromRazorpay;
      feeAccount.breakdown[feeTypeFromNotes] = 0; // Mark this fee type as paid

      // Update status
      if (feeAccount.balance === 0) {
        feeAccount.status = "Paid";
      } else {
        feeAccount.status = "Partial";
      }

      // 5. Create and save the Receipt
      const newReceipt = new Receipt({
        feeAccount: feeAccount._id,
        txnId: payment_id,
        student: loggedInStudentId,
        amount: amountFromRazorpay,
        feeType: feeTypeFromNotes,
      });
      await newReceipt.save();

      // Add transaction record
      feeAccount.transactions.push({
        amount: amountFromRazorpay,
        mode: "Card/UPI",
        txnId: payment_id,
        status: "Completed",
        receiptId: newReceipt._id,
        note: `Payment for ${feeTypeFromNotes}`,
        feeType: feeTypeFromNotes, // Save feeType in the transaction
      });

      await feeAccount.save();

      // send email to student about payment success
      const student = await Admission.findById(loggedInStudentId);
      const studentDetails = {
        fullname: student.fullname, 
        amount: amountFromRazorpay,
        feeType: feeTypeFromNotes,
        txnId: payment_id,
      };
      
      const emailContent = getPaymentDoneEmailContent(studentDetails);
      await sendEmail(student.email, emailContent.subject, emailContent.html, emailContent.text);

      // --- START of Hostel Room Allotment Logic ---
      // const student = await Admission.findById(loggedInStudentId);
      if (
        student &&
        student.hostel.status === "Accepted" &&
        feeTypeFromNotes === "hostel" &&
        feeAccount.balance === 0
      ) {
        const hostelName = student.hostel.hostelNumber;
        const hostel = await Hostel.findOne({ name: hostelName });
        if (hostel) {
          const newRoomNumber = getNextAvailableRoom(hostel);
          if (newRoomNumber) {
            // Allot the room to the student
            student.hostel.roomNumber = newRoomNumber;
            student.hostel.status = "Allotted";
            await student.save();

            // Update the Hostel model occupancy
            const floorName = newRoomNumber.split("-")[0];
            const floor = hostel.floors.find((f) => f.name === floorName);
            if (floor) {
              floor.occupiedRooms += 1;
            }
            hostel.occupiedRooms += 1;
            hostel.reservedRooms -= 1; // Free up the reserved spot
            await hostel.save();

            // send email to student about room allotment
            const studentDetails = {
              fullname: student.fullname,
              hostelNumber: student.hostel.hostelNumber,
              roomNumber: student.hostel.roomNumber,
            };

            const emailContent = getHostelAllottedEmailContent(studentDetails);
            await sendEmail(student.email, emailContent.subject, emailContent.html, emailContent.text);

          } else {
            console.warn(`Hostel ${hostelName} is full. Cannot allot room.`);
          }
        }
      }
      // --- END of Hostel Room Allotment Logic ---

      return res.status(200).json({
        success: true,
        message: "Payment verified and data updated successfully.",
        data: {
          feeAccount,
          receipt: newReceipt,
        },
      });
    } catch (error) {
      console.error("Error in verifyPayment:", error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
        error: error.message,
      });
    }
  };

  static downloadReceipt = async (req, res) => {
    try {
      const { id } = req.params; //receipt id from transaction

      // 1. Fetch the receipt and related data
      const receipt = await Receipt.findById(id).populate({
        path: "student",
        model: Admission,
        select:
          "fullname studentID academics.course academics.semester academics.academicYear",
      });

      // console.log(receipt);

      if (!receipt) {
        return res
          .status(404)
          .json({ success: false, message: "Receipt not found." });
      }

      // 2. Set response headers for PDF download
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=receipt_${receipt.txnId}.pdf`
      );

      // 3. Create a new PDF document
      const doc = new PDFDocument();

      // 4. Pipe the PDF to the response stream
      doc.pipe(res);

      // 5. Add content to the PDF
      doc.fontSize(25).text("FEE PAYMENT RECEIPT", { align: "center" });
      doc.moveDown();
      doc.fontSize(16).text(`Receipt ID: ${receipt._id}`);
      doc.text(`Date: ${receipt.date.toLocaleDateString()}`);
      doc.moveDown();
      doc.text(`Student Name: ${receipt.student.fullname}`);
      doc.text(`Student ID: ${receipt.student.studentID}`);
      doc.text(`Course: ${receipt.student.academics.course} `);
      doc.text(`Semester: ${receipt.student.academics.semester}`);
      doc.text(`Session: ${receipt.student.academicYear}`);
      doc.text(`Payment For: ${receipt.feeType}`);
      doc.text(`Paid Amount: ₹${receipt.amount.toLocaleString()}`);
      doc.moveDown();
      doc.text("----------------------------------------------------");
      doc.text("Payment Details:");
      doc.text(`Transaction ID: ${receipt.txnId}`);
      doc.moveDown();
      doc.fontSize(12).text("Thank you for your payment.", { align: "center" });

      // 6. Finalize the PDF
      doc.end();
    } catch (error) {
      console.error("Error generating PDF receipt:", error);
      return res
        .status(500)
        .json({
          success: false,
          message: "Server Error",
          error: error.message,
        });
    }
  };
}

export default StudentFeeController;
