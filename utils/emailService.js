// utils/emailService.js
const nodemailer = require('nodemailer');

// -----------------------------------------------------------------------------
// SMTP configuration (all values come from .env)
//
//   EMAIL_HOST  e.g. mail.fullmoon-hotels.com
//   EMAIL_PORT  465 (SSL/TLS) or 587 (STARTTLS)
//   EMAIL_USER  full mailbox address, e.g. reservations@fullmoon-hotels.com
//   EMAIL_PASS  mailbox password
//   EMAIL_FROM  optional "from" address (defaults to EMAIL_USER)
//
// Port 465 needs an encrypted connection from the first byte (secure: true).
// Port 587/25 start in plain text and upgrade with STARTTLS (secure: false).
// Getting this wrong makes Nodemailer hang until "Greeting never received",
// so `secure` is derived from the port instead of being hard-coded.
// -----------------------------------------------------------------------------
const EMAIL_HOST = process.env.EMAIL_HOST || 'mail.fullmoon-hotels.com';
const EMAIL_PORT = Number(process.env.EMAIL_PORT) || 465;
const EMAIL_SECURE = EMAIL_PORT === 465;
const EMAIL_FROM = process.env.EMAIL_FROM || process.env.EMAIL_USER;

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_SECURE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  // Fail fast instead of hanging for 30s+ when the mail server is unreachable
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 30000,
  tls: {
    // Shared hosts (e.g. Bluehost) often present a certificate for the server
    // name (box####.bluehost.com) rather than mail.<domain>
    rejectUnauthorized: false
  }
});

function isEmailConfigured() {
  return Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);
}

// Check the SMTP connection once at startup so config problems show up in the
// logs immediately rather than on the first booking.
async function verifyEmailConnection() {
  if (!isEmailConfigured()) {
    console.warn('⚠️  Email not configured: set EMAIL_USER and EMAIL_PASS in .env');
    return false;
  }
  try {
    await transporter.verify();
    console.log(`📧 SMTP ready: ${EMAIL_HOST}:${EMAIL_PORT} (${EMAIL_SECURE ? 'SSL/TLS' : 'STARTTLS'}) as ${process.env.EMAIL_USER}`);
    return true;
  } catch (error) {
    console.error(`❌ SMTP check failed for ${EMAIL_HOST}:${EMAIL_PORT} (${EMAIL_SECURE ? 'SSL/TLS' : 'STARTTLS'}): ${error.message}`);
    return false;
  }
}

// Format date for email
function formatDateForEmail(date) {
  if (!date) return '';
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  }).replace(/\//g, '.');
}

// Generate email template
function generateReservationEmail(reservation, nights) {
  const arrivalDate = formatDateForEmail(reservation.checkIn);
  const departureDate = formatDateForEmail(reservation.checkOut);
  const currentDate = formatDateForEmail(new Date());
  
  return `
ATTN: ${reservation.guestName}

FROM:
Fullmoon Hotels, Owerri, Imo State.

DIRECT PHONE: +234 (0) 812 313 9279, +234 (0) 7078050547
EMAIL: reservations@fullmoon-hotels.com

SUBJECT: Hotel Accommodation

DATE: ${currentDate}

Thank you for choosing the Fullmoon Hotels Owerri. We are delighted to confirm your reservation as follows:

Guest Name: ${reservation.guestName}

Arrival Date: ${arrivalDate}

Departure Date: ${departureDate}

Number of persons: ${reservation.guests} ${reservation.guests === 1 ? 'Adult' : 'Adults'}

Number of room(s): 1 ${reservation.room ? reservation.room.name || 'DELUXE ROOM' : 'DELUXE ROOM'}

Number of nights: ${nights}

Total Amount: ${reservation.totalAmount.toLocaleString()} NGN

The quoted rate is only valid for the above dates. The rate includes 7.5% VAT, 5% Consumption Tax, 10% service charge and breakfast. Kindly note that breakfast element shall be removed if discounts are applied on same rates.

The above accommodation will be held until 4pm of the arrival date; and cancelled when payment is not received. You can guarantee the reservation through bank transfer or by directly paying at the front Office of the hotel. One night deposit payable at the hotel or any of our Access Bank branches nationwide-Account Number (0066351262) OR ΜΟΝΙΕΡΟΙΝΤ (5033192156). Please note that No show charges apply.

Check-in time is from 2:00pm on arrival day and check-out time is 12:00 noon. Late check-out and early check-in charges apply. Our rooms are non-smoking and penalties apply to defaulters.

For further information about the hotel, Restaurant reservation and our services please do contact us anytime at the above telephone, fax number or email. We wish to reassure you that safety and security of our guests and team members remain our key priority. Our Front office team will keep in touch with you during your stay with us.

We look forward to welcoming you to the Fullmoon Hotels Owerri.

Yours sincerely,
Fullmoon Hotels Management
  `;
}

// Send reservation confirmation email
async function sendReservationConfirmation(reservation) {
  try {
    // Calculate nights
    const nights = Math.ceil((reservation.checkOut - reservation.checkIn) / (1000 * 60 * 60 * 24));
    
    const mailOptions = {
      from: `"Fullmoon Hotels" <${EMAIL_FROM}>`,
      to: reservation.guestEmail,
      cc: process.env.EMAIL_CC ? process.env.EMAIL_CC.split(',') : undefined,
      bcc: process.env.EMAIL_BCC ? process.env.EMAIL_BCC.split(',') : undefined,
      subject: `Reservation Confirmation - ${reservation.confirmationCode || reservation._id}`,
      text: generateReservationEmail(reservation, nights),
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reservation Confirmation - Fullmoon Hotels</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #1a365d; color: white; padding: 30px 20px; text-align: center; }
                .header h1 { margin: 0; font-size: 24px; }
                .header p { margin: 5px 0 0 0; opacity: 0.9; }
                .content { padding: 30px 20px; background-color: #fff; }
                .reservation-details { background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-left: 4px solid #1a365d; border-radius: 4px; }
                .detail-row { margin: 10px 0; display: flex; }
                .detail-label { font-weight: bold; min-width: 180px; }
                .detail-value { color: #1a365d; }
                .highlight-box { background-color: #e8f4fd; border: 1px solid #b6d4fe; border-radius: 4px; padding: 15px; margin: 20px 0; }
                .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eaeaea; color: #666; font-size: 12px; text-align: center; }
                .button { display: inline-block; background-color: #1a365d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 10px 0; }
                @media (max-width: 600px) {
                    .detail-row { flex-direction: column; }
                    .detail-label { min-width: auto; margin-bottom: 5px; }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Fullmoon Hotels</h1>
                    <p>Owerri, Imo State</p>
                </div>
                
                <div class="content">
                    <p><strong>Reservation Confirmation</strong></p>
                    <p>Dear ${reservation.guestName},</p>
                    
                    <p>Thank you for choosing Fullmoon Hotels Owerri. We are delighted to confirm your reservation as follows:</p>
                    
                    <div class="reservation-details">
                        <div class="detail-row">
                            <div class="detail-label">Guest Name:</div>
                            <div class="detail-value">${reservation.guestName}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Confirmation Code:</div>
                            <div class="detail-value">${reservation.confirmationCode || reservation._id}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Arrival Date:</div>
                            <div class="detail-value">${formatDateForEmail(reservation.checkIn)}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Departure Date:</div>
                            <div class="detail-value">${formatDateForEmail(reservation.checkOut)}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Number of Nights:</div>
                            <div class="detail-value">${nights}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Number of Guests:</div>
                            <div class="detail-value">${reservation.guests} ${reservation.guests === 1 ? 'Adult' : 'Adults'}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Room Type:</div>
                            <div class="detail-value">${reservation.room ? reservation.room.name || 'Deluxe Room' : 'Deluxe Room'}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Total Amount:</div>
                            <div class="detail-value"><strong>${reservation.totalAmount.toLocaleString()} NGN</strong></div>
                        </div>
                    </div>
                    
                    <div class="highlight-box">
                        <h3>Important Information:</h3>
                        <p><strong>Payment Details:</strong></p>
                        <p>• ΜΟΝΙΕΡΟΙΝΤ: 5033192156</p>
                        <p>• Access Bank Account: 0066351262</p>
                        <p>• One night deposit required to guarantee reservation</p>
                        
                        <p><strong>Check-in/Check-out:</strong></p>
                        <p>• Check-in: 2:00 PM</p>
                        <p>• Check-out: 12:00 PM</p>
                        <p>• Late check-out and early check-in charges apply</p>
                        
                        <p><strong>Contact Information:</strong></p>
                        <p>• Phone: +234 (0) 812 313 9279, +234 (0) 7078050547</p>
                        <p>• Email: reservations@fullmoon-hotels.com</p>
                    </div>
                    
                    <p>We wish to reassure you that safety and security of our guests and team members remain our key priority. Our Front office team will keep in touch with you during your stay with us.</p>
                    
                    <p>We look forward to welcoming you to Fullmoon Hotels Owerri!</p>
                    
                    <p>Sincerely,<br>
                    <strong>Fullmoon Hotels Management</strong></p>
                </div>
                
                <div class="footer">
                    <p>Fullmoon Hotels | Owerri, Imo State, Nigeria</p>
                    <p>${new Date().getFullYear()} © All rights reserved</p>
                </div>
            </div>
        </body>
        </html>
      `
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${reservation.guestEmail}:`, info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending reservation email:', error);
    throw error;
  }
}

module.exports = {
  sendReservationConfirmation,
  verifyEmailConnection,
  isEmailConfigured,
  transporter,
  EMAIL_FROM,
  formatDateForEmail
};