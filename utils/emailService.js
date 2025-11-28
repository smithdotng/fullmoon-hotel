// utils/emailService.js
const nodemailer = require('nodemailer');

// Create transporter (configure with your email service)
const transporter = nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER || 'reservations@fullmoon-hotels.com',
        pass: process.env.EMAIL_PASS || 'your-email-password'
    }
});

// Function to format date as DD.MM.YY
function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}.${month}.${year}`;
}

// Function to send reservation confirmation email
async function sendReservationConfirmation(reservation, room) {
    try {
        const checkInDate = new Date(reservation.checkIn);
        const checkOutDate = new Date(reservation.checkOut);
        const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
        
        const mailOptions = {
            from: '"Full Moon Hotels Reservations" <reservations@fullmoon-hotels.com>',
            to: reservation.guestEmail,
            subject: 'Hotel Accommodation Confirmation - Full Moon Hotels',
            html: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #c19b76; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .details { background: #f9f9f9; padding: 15px; margin: 15px 0; border-left: 4px solid #c19b76; }
        .footer { background: #333; color: white; padding: 20px; text-align: center; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #f5f5f5; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Full Moon Hotels</h1>
        <p>Owerri, Imo State</p>
    </div>
    
    <div class="content">
        <p><strong>ATTN:</strong> ${reservation.guestName}</p>
        <p><strong>FROM:</strong> MRS DEBORAH UCHE</p>
        <p><strong>DIRECT PHONE:</strong> +234 (0) 812 313 9279, +234 (0) 7078050547</p>
        <p><strong>EMAIL:</strong> reservations@fullmoon-hotels.com</p>
        <p><strong>SUBJECT:</strong> Hotel Accommodation</p>
        <p><strong>DATE:</strong> ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        
        <p>Dear ${reservation.guestName},</p>
        
        <p>Thank you for choosing the Full Moon Hotels Owerri. We are delighted to confirm your reservation as follows:</p>
        
        <div class="details">
            <table>
                <tr>
                    <td><strong>Guest Name:</strong></td>
                    <td>${reservation.guestName}</td>
                </tr>
                <tr>
                    <td><strong>Arrival Date:</strong></td>
                    <td>${formatDate(checkInDate)}</td>
                </tr>
                <tr>
                    <td><strong>Departure Date:</strong></td>
                    <td>${formatDate(checkOutDate)}</td>
                </tr>
                <tr>
                    <td><strong>Number of persons:</strong></td>
                    <td>${reservation.guests} ${reservation.guests === 1 ? 'Adult' : 'Adults'}</td>
                </tr>
                <tr>
                    <td><strong>Number of room(s):</strong></td>
                    <td>1 ${room.type}</td>
                </tr>
                <tr>
                    <td><strong>Rate per night:</strong></td>
                    <td>${room.price.toLocaleString()} NGN</td>
                </tr>
                <tr>
                    <td><strong>Number of nights:</strong></td>
                    <td>${nights}</td>
                </tr>
                <tr>
                    <td><strong>Total Amount:</strong></td>
                    <td>${reservation.totalAmount.toLocaleString()} NGN</td>
                </tr>
            </table>
        </div>
        
        <p>The quoted rate is only valid for the above dates. The rate includes 7.5% VAT, 5% Consumption Tax, 10% service charge and breakfast. Kindly note that breakfast element shall be removed if discounts are applied on same rates.</p>
        
        <p><strong>Payment Information:</strong><br>
        The above accommodation will be held until 4pm of the arrival date; and cancelled when payment is not received. You can guarantee the reservation through bank transfer or by directly paying at the front Office of the hotel. One night deposit payable at the hotel or any of our Access Bank branches nationwide-Account Number (0066351262) OR MONIE POINT (5033192156). Please note that No show charges apply.</p>
        
        <p><strong>Check-in/Check-out:</strong><br>
        Check-in time is from 2:00pm on arrival day and check-out time is 12:00 noon. Late check-out and early check-in charges apply. Our rooms are non-smoking and penalties apply to defaulters.</p>
        
        <p>For further information about the hotel, Restaurant reservation and our services please do contact us anytime at the above telephone, fax number or email. We wish to reassure you that safety and security of our guests and team members remain our key priority. Our Front office team will keep in touch with you during your stay with us.</p>
        
        <p>We look forward to welcoming ${reservation.guestName} to the Full Moon Hotels Owerri.</p>
        
        <p>Yours sincerely,<br>
        <strong>DEBORAH UCHE</strong><br>
        Reservations Manager<br>
        Full Moon Hotels</p>
    </div>
    
    <div class="footer">
        <p>Full Moon Hotels | Housing Area C, New Owerri | +234 (0) 812 313 9279</p>
        <p>Email: reservations@fullmoon-hotels.com | Website: https://fullmoon.found.ng</p>
    </div>
</body>
</html>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Reservation confirmation email sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending reservation confirmation email:', error);
        throw error;
    }
}

module.exports = {
    sendReservationConfirmation
};