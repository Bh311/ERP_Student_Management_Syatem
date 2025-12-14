export const getAdmissionAppliedEmailContent = (studentDetails) => {
  const { fullname, studentID } = studentDetails;

  const htmlBody = `
    <table width="100%" cellspacing="0" cellpadding="0" style="font-family: Arial, sans-serif; background-color: #f7f7f7;">
      <tr>
        <td align="center" style="padding: 20px;">
          <table width="600" cellspacing="0" cellpadding="0" style="background-color: #fff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <tr>
              <td style="padding: 40px; text-align: center;">
                <h1 style="color: #333; font-size: 28px;">Application Received</h1>
                <p style="font-size: 16px; color: #555; line-height: 1.5; margin-top: 20px;">
                  Hello ${fullname},
                </p>
                <p style="font-size: 16px; color: #555; line-height: 1.5; margin-top: 10px;">
                  Thank you for applying to our college ERP system. We have successfully received your application.
                </p>
                <table width="100%" cellspacing="0" cellpadding="0" style="margin-top: 30px; text-align: center; background-color: #f0f0f0; padding: 20px; border-radius: 8px;">
                  <tr>
                    <td>
                      <p style="font-size: 18px; color: #333; font-weight: bold;">Your Application ID:</p>
                      <p style="font-size: 24px; color: #007bff; font-weight: bold; margin-top: 5px;">${studentID}</p>
                    </td>
                  </tr>
                </table>
                <p style="font-size: 14px; color: #888; margin-top: 30px;">
                  We will notify you once your application has been reviewed by our admissions team.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  return {
    subject: "Your Application Has Been Received",
    html: htmlBody,
    text: `Hello ${fullname},\n\nThank you for applying. Your application has been received with ID: ${studentID}. We will notify you once your application has been reviewed.`,
  };
};

export const getWelcomeEmailContent = (studentDetails) => {
  const { studentID, email, password } = studentDetails;
  
  const htmlBody = `
    <table width="100%" cellspacing="0" cellpadding="0" style="font-family: Arial, sans-serif;">
      <tr>
        <td align="center" style="padding: 20px;">
          <table width="600" cellspacing="0" cellpadding="0" style="background-color: #f7f7f7; border-radius: 8px; overflow: hidden;">
            <tr>
              <td style="padding: 40px; text-align: center;">
                <h1 style="color: #333; font-size: 28px;">Welcome to the ERP System!</h1>
                <p style="font-size: 16px; color: #555; line-height: 1.5;">
                  Your account has been successfully created. Please find your login credentials below.
                </p>
                <table width="100%" cellspacing="0" cellpadding="0" style="margin-top: 20px; text-align: left; background-color: #fff; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
                  <tr>
                    <td style="padding-bottom: 10px;">
                      <p style="font-size: 16px; color: #333; font-weight: bold;">Student ID:</p>
                      <p style="font-size: 16px; color: #555;">${studentID}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 10px;">
                      <p style="font-size: 16px; color: #333; font-weight: bold;">Email:</p>
                      <p style="font-size: 16px; color: #555;">${email}</p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p style="font-size: 16px; color: #333; font-weight: bold;">Password:</p>
                      <p style="font-size: 16px; color: #555;">${password}</p>
                    </td>
                  </tr>
                </table>
                <p style="font-size: 14px; color: #888; margin-top: 30px;">
                  Please log in and change your password for security.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  return {
    subject: "Welcome to the ERP System!",
    html: htmlBody,
    text: `Your login credentials: Student ID: ${studentID}, Email: ${email}, Password: ${password}`,
  };
};

export const getAdmissionRejectionEmailContent = (studentDetails) => {
  const { fullname } = studentDetails;
  return {
    subject: "Application Status: Rejected",
    html: `
      <p>Hello ${fullname},</p>
      <p>We regret to inform you that we are unable to offer you admission at this time. We received a high volume of applications, and this was a very difficult decision.</p>
      <p>We wish you the best of luck in your future endeavors.</p>
      <p>Best regards,<br>The Admissions Team</p>
    `,
    text: `Hello ${fullname},\n\nWe regret to inform you that your application for admission has been rejected.`,
  };
};

export const getHostelApprovedEmailContent = (studentDetails) => {
  const { fullname, hostelNumber, reservationExpiryDate } = studentDetails;
  return {
    subject: "Hostel Application Approved",
    html: `
      <p>Hello ${fullname},</p>
      <p>Great news! Your hostel application has been approved. A spot in Hostel ${hostelNumber} has been reserved for you. Please pay the hostel fees by ${reservationExpiryDate.toLocaleDateString()} to secure your room.</p>
      <p>Once payment is complete, your room number will be assigned to you.</p>
      <p>Best regards,<br>The ERP Team</p>
    `,
    text: `Hello ${fullname},\n\nYour hostel application has been approved. Please pay the fees by ${reservationExpiryDate.toLocaleDateString()}.`,
  };
};

export const getHostelRejectionEmailContent = (studentDetails) => {
  const { fullname } = studentDetails;
  return {
    subject: "Hostel Application Rejected",
    html: `
      <p>Hello ${fullname},</p>
      <p>We regret to inform you that your hostel application has been rejected due to limited availability.</p>
      <p>Best regards,<br>The ERP Team</p>
    `,
    text: `Hello ${fullname},\n\nYour hostel application has been rejected.`,
  };
};

export const getHostelAllottedEmailContent = (studentDetails) => {
  const { fullname, hostelNumber, roomNumber } = studentDetails;
  
  return {
    subject: "Hostel Room Allotted",
    html: `
      <table width="100%" cellspacing="0" cellpadding="0" style="font-family: Arial, sans-serif;">
        <tr>
          <td align="center" style="padding: 20px;">
            <table width="600" cellspacing="0" cellpadding="0" style="background-color: #f7f7f7; border-radius: 8px; overflow: hidden;">
              <tr>
                <td style="padding: 40px; text-align: center;">
                  <h1 style="color: #333; font-size: 28px;">Congratulations, ${fullname}!</h1>
                  <p style="font-size: 16px; color: #555; line-height: 1.5;">
                    Your payment for the hostel fee has been verified, and your room has been successfully allotted.
                  </p>
                  <table width="100%" cellspacing="0" cellpadding="0" style="margin-top: 20px; text-align: left; background-color: #fff; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
                    <tr>
                      <td style="padding-bottom: 10px;">
                        <p style="font-size: 16px; color: #333; font-weight: bold;">Hostel Name:</p>
                        <p style="font-size: 16px; color: #555;">${hostelNumber}</p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p style="font-size: 16px; color: #333; font-weight: bold;">Room Number:</p>
                        <p style="font-size: 16px; color: #555;">${roomNumber}</p>
                      </td>
                    </tr>
                  </table>
                  <p style="font-size: 14px; color: #888; margin-top: 30px;">
                    Welcome to the hostel! We hope you have a pleasant stay.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `,
    text: `Hello ${fullname},\n\nYour hostel fee payment has been verified, and your room has been allotted.\n\nHostel Name: ${hostelNumber}\nRoom Number: ${roomNumber}\n\nWelcome to the hostel!`,
  };
};

export const getPaymentDoneEmailContent = (studentDetails) => {
  const { fullname, amount, feeType, txnId } = studentDetails;
  return {
    subject: "Payment Confirmed",
    html: `
      <p>Hello ${fullname},</p>
      <p>Thank you for your payment of ₹${amount} for your ${feeType} fees.</p>
      <p>Your payment has been confirmed. Transaction ID: ${txnId}</p>
      <p>Best regards,<br>The ERP Team</p>
    `,
    text: `Hello ${fullname},\n\nThank you for your payment of ₹${amount} for your ${feeType} fees.`,
  };
};

export const getPaymentFailedEmailContent = (studentDetails) => {
  const { fullname, feeType } = studentDetails;
  return {
    subject: "Payment Failed",
    html: `
      <p>Hello ${fullname},</p>
      <p>Your recent payment attempt for ${feeType} fees was unsuccessful.</p>
      <p>Please check your payment details and try again.</p>
      <p>Best regards,<br>The ERP Team</p>
    `,
    text: `Hello ${fullname},\n\nYour recent payment attempt for ${feeType} fees has failed.`,
  };
};

export const getReservationExpiredEmailContent = (studentDetails) => {
  const { fullname, hostelNumber } = studentDetails;
  
  return {
    subject: "Hostel Reservation Expired",
    html: `
      <table width="100%" cellspacing="0" cellpadding="0" style="font-family: Arial, sans-serif;">
        <tr>
          <td align="center" style="padding: 20px;">
            <table width="600" cellspacing="0" cellpadding="0" style="background-color: #f7f7f7; border-radius: 8px; overflow: hidden;">
              <tr>
                <td style="padding: 40px; text-align: center;">
                  <h1 style="color: #d9534f; font-size: 28px;">Hostel Reservation Cancelled</h1>
                  <p style="font-size: 16px; color: #555; line-height: 1.5;">
                    Hello ${fullname},
                  </p>
                  <p style="font-size: 16px; color: #555; line-height: 1.5; margin-top: 20px;">
                    This is a notification that your hostel reservation in Hostel ${hostelNumber} has been cancelled because the payment deadline was not met.
                  </p>
                  <p style="font-size: 16px; color: #555; line-height: 1.5; margin-top: 10px;">
                    The hostel fee has been removed from your account, and the spot has been made available to other students.
                  </p>
                  <p style="font-size: 14px; color: #888; margin-top: 30px;">
                    Please contact the hostel office if you have any questions.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `,
    text: `Hello ${fullname},\n\nYour hostel reservation in Hostel ${hostelNumber} has been cancelled because the payment deadline was not met. The hostel fee has been removed from your account.`,
  };
};
