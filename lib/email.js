import nodemailer from 'nodemailer';

// SMTP configuration (all values from .env) - see .env.example.
// Port 465 needs TLS from the first byte (secure: true); 587/25 upgrade with
// STARTTLS (secure: false), so `secure` is derived from the port.
const EMAIL_HOST = process.env.EMAIL_HOST || 'mail.fullmoon-hotels.com';
const EMAIL_PORT = Number(process.env.EMAIL_PORT) || 465;
const EMAIL_SECURE = EMAIL_PORT === 465;
export const EMAIL_FROM = process.env.EMAIL_FROM || process.env.EMAIL_USER;

let transporter = globalThis.__fmMailer;
export function getTransporter() {
  if (!transporter) {
    transporter = globalThis.__fmMailer = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      secure: EMAIL_SECURE,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 30000,
      // Shared hosts often present a certificate for the server name rather than mail.<domain>
      tls: { rejectUnauthorized: false },
    });
  }
  return transporter;
}

export function isEmailConfigured() {
  return Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);
}

export async function sendMail(options) {
  if (!isEmailConfigured()) {
    console.log('📧 Email not configured (EMAIL_USER/EMAIL_PASS). Would have sent:', options.subject, '→', options.to);
    return null;
  }
  return getTransporter().sendMail(options);
}

export async function verifyEmailConnection() {
  if (!isEmailConfigured()) return false;
  try {
    await getTransporter().verify();
    return true;
  } catch (error) {
    console.error(`❌ SMTP check failed for ${EMAIL_HOST}:${EMAIL_PORT}: ${error.message}`);
    return false;
  }
}

export const escapeHtml = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export function formatDateForEmail(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '.');
}

function roomLabel(reservation) {
  return reservation.room?.type || 'Deluxe Room';
}

function reservationText(reservation, nights) {
  return `
ATTN: ${reservation.guestName}

FROM:
Fullmoon Hotels, Owerri, Imo State.

DIRECT PHONE: +234 (0) 812 313 9279, +234 (0) 7078050547
EMAIL: reservations@fullmoon-hotels.com

SUBJECT: Hotel Accommodation

DATE: ${formatDateForEmail(new Date())}

Thank you for choosing the Fullmoon Hotels Owerri. We are delighted to confirm your reservation as follows:

Guest Name: ${reservation.guestName}

Arrival Date: ${formatDateForEmail(reservation.checkIn)}

Departure Date: ${formatDateForEmail(reservation.checkOut)}

Number of persons: ${reservation.guests} ${reservation.guests === 1 ? 'Adult' : 'Adults'}

Number of room(s): 1 ${roomLabel(reservation).toUpperCase()}

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

function reservationHtml(reservation, nights) {
  const e = escapeHtml;
  const row = (label, value) =>
    `<div class="detail-row"><div class="detail-label">${label}</div><div class="detail-value">${value}</div></div>`;
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
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
  @media (max-width: 600px) { .detail-row { flex-direction: column; } .detail-label { min-width: auto; margin-bottom: 5px; } }
</style>
</head>
<body>
<div class="container">
  <div class="header"><h1>Fullmoon Hotels</h1><p>Owerri, Imo State</p></div>
  <div class="content">
    <p><strong>Reservation Confirmation</strong></p>
    <p>Dear ${e(reservation.guestName)},</p>
    <p>Thank you for choosing Fullmoon Hotels Owerri. We are delighted to confirm your reservation as follows:</p>
    <div class="reservation-details">
      ${row('Guest Name:', e(reservation.guestName))}
      ${row('Confirmation Code:', e(reservation.confirmationCode || reservation._id))}
      ${row('Arrival Date:', formatDateForEmail(reservation.checkIn))}
      ${row('Departure Date:', formatDateForEmail(reservation.checkOut))}
      ${row('Number of Nights:', nights)}
      ${row('Number of Guests:', `${reservation.guests} ${reservation.guests === 1 ? 'Adult' : 'Adults'}`)}
      ${row('Room Type:', e(roomLabel(reservation)))}
      ${row('Total Amount:', `<strong>${reservation.totalAmount.toLocaleString()} NGN</strong>`)}
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
    <p>Sincerely,<br><strong>Fullmoon Hotels Management</strong></p>
  </div>
  <div class="footer"><p>Fullmoon Hotels | Owerri, Imo State, Nigeria</p><p>${new Date().getFullYear()} © All rights reserved</p></div>
</div>
</body>
</html>`;
}

export async function sendReservationConfirmation(reservation) {
  const nights = Math.ceil((new Date(reservation.checkOut) - new Date(reservation.checkIn)) / 86400000);
  return sendMail({
    from: `"Fullmoon Hotels" <${EMAIL_FROM}>`,
    to: reservation.guestEmail,
    cc: process.env.EMAIL_CC ? process.env.EMAIL_CC.split(',') : undefined,
    bcc: process.env.EMAIL_BCC ? process.env.EMAIL_BCC.split(',') : undefined,
    subject: `Reservation Confirmation - ${reservation.confirmationCode || reservation._id}`,
    text: reservationText(reservation, nights),
    html: reservationHtml(reservation, nights),
  });
}
