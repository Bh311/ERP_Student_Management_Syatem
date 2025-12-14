import nodemailer from "nodemailer";
import dotenv from "dotenv"
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASS, // Must be Gmail App Password
  },
});


const sendEmail = async (email, subject, body, textBody) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: email,
      subject,
      html: body,
      text: textBody,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log("Mail sent successfully [sendEmail method] ✅", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending mail  [sendEmail method]  ❌:", error.message);
    throw error;
  }
};

export default sendEmail;
