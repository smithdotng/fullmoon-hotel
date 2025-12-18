// routes/reservations.js
const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const Room = require('../models/Room');
const mongoose = require('mongoose');
const { sendReservationConfirmation } = require('../utils/emailService'); // Add this line

// GET /reservations/guest/:id - Guest reservation confirmation page
router.get('/guest/:id', async (req, res) => {
  try {
    console.log('=== GUEST RESERVATION ROUTE HIT ===');
    const reservationId = req.params.id;
    
    console.log('Looking for reservation:', reservationId);
    
    if (!mongoose.Types.ObjectId.isValid(reservationId)) {
      console.log('Invalid reservation ID format');
      return res.status(404).render('error', {
        title: 'Reservation Not Found',
        error: 'Invalid reservation ID'
      });
    }

    const reservation = await Reservation.findById(reservationId).populate('room');
    
    console.log('Reservation found:', reservation ? 'YES' : 'NO');
    
    if (!reservation) {
      console.log('Reservation not found in database');
      return res.status(404).render('error', {
        title: 'Reservation Not Found',
        error: 'The requested reservation was not found.'
      });
    }

    // Calculate nights for display
    const nights = Math.ceil((reservation.checkOut - reservation.checkIn) / (1000 * 60 * 60 * 24));

    console.log('Rendering guest-reservation.ejs with reservation data');
    
    res.render('rooms/guest-reservation', {
      title: 'Booking Confirmed - Full Moon Hotels',
      reservation,
      nights
    });
  } catch (error) {
    console.error('Error loading guest reservation:', error);
    res.status(500).render('error', {
      title: 'Server Error',
      error: 'Failed to load reservation details'
    });
  }
});

// POST /reservations - Create new reservation (for admin panel or API)
router.post('/', async (req, res) => {
  try {
    console.log('=== CREATE RESERVATION ROUTE HIT ===');
    
    const {
      guestName,
      guestEmail,
      guestPhone,
      roomId,
      checkIn,
      checkOut,
      guests,
      roomRate,
      totalAmount,
      paymentMethod = 'cash',
      notes = '',
      status = 'confirmed'
    } = req.body;

    // Validate required fields
    if (!guestName || !guestEmail || !guestPhone || !roomId || !checkIn || !checkOut || !guests) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required fields'
      });
    }

    // Check if room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Calculate nights
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    // Use provided roomRate or default to room price
    const calculatedRoomRate = roomRate || room.price;
    const calculatedTotalAmount = totalAmount || (calculatedRoomRate * nights);

    // Determine payment status based on payment method
    let paymentStatus = 'unpaid';
    if (paymentMethod === 'card' || paymentMethod === 'bank_transfer' || paymentMethod === 'moniepoint') {
      paymentStatus = 'paid';
    }

    // Create reservation
    const reservation = new Reservation({
      guestName,
      guestEmail,
      guestPhone,
      room: roomId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      nights,
      guests: parseInt(guests),
      roomRate: calculatedRoomRate,
      totalAmount: calculatedTotalAmount,
      paymentMethod,
      paymentStatus,
      status,
      notes
    });

    await reservation.save();
    
    // Populate room data for email
    const populatedReservation = await Reservation.findById(reservation._id).populate('room');
    
    console.log('Reservation created:', reservation._id, 'Confirmation Code:', reservation.confirmationCode);

    // Send confirmation email (don't await to avoid delaying response)
    sendReservationConfirmation(populatedReservation)
      .then(() => {
        console.log('Confirmation email sent successfully to:', guestEmail);
      })
      .catch(emailError => {
        console.error('Failed to send email, but reservation was created:', emailError);
        // Don't fail the reservation creation if email fails
      });

    // Send response
    res.status(201).json({
      success: true,
      message: 'Reservation created successfully',
      reservationId: reservation._id,
      confirmationCode: reservation.confirmationCode,
      data: reservation
    });

  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating reservation',
      error: error.message
    });
  }
});

// POST /reservations/quick - Quick reservation creation (simpler form)
router.post('/quick', async (req, res) => {
  try {
    const {
      guestName,
      guestEmail,
      guestPhone,
      roomId,
      checkIn,
      checkOut,
      guests,
      roomRate
    } = req.body;

    // Basic validation
    if (!guestName || !guestEmail || !guestPhone || !roomId || !checkIn || !checkOut || !guests) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const calculatedRoomRate = roomRate || room.price;
    const totalAmount = calculatedRoomRate * nights;

    const reservation = new Reservation({
      guestName,
      guestEmail,
      guestPhone,
      room: roomId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      nights,
      guests: parseInt(guests),
      roomRate: calculatedRoomRate,
      totalAmount,
      paymentMethod: 'cash',
      paymentStatus: 'unpaid',
      status: 'confirmed'
    });

    await reservation.save();
    const populatedReservation = await Reservation.findById(reservation._id).populate('room');

    // Send email
    sendReservationConfirmation(populatedReservation)
      .then(() => console.log('Email sent to:', guestEmail))
      .catch(err => console.error('Email error:', err));

    res.status(201).json({
      success: true,
      message: 'Reservation created',
      reservationId: reservation._id,
      confirmationCode: reservation.confirmationCode
    });

  } catch (error) {
    console.error('Quick reservation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// POST /reservations/:id/resend-email - Resend confirmation email
router.post('/:id/resend-email', async (req, res) => {
  try {
    const reservationId = req.params.id;
    
    if (!mongoose.Types.ObjectId.isValid(reservationId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reservation ID'
      });
    }

    const reservation = await Reservation.findById(reservationId).populate('room');
    
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    // Send confirmation email
    await sendReservationConfirmation(reservation);
    
    console.log('Email resent for reservation:', reservationId);
    
    res.json({
      success: true,
      message: 'Confirmation email resent successfully'
    });
  } catch (error) {
    console.error('Error resending email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend email'
    });
  }
});

// GET /reservations/:id/email-preview - Preview email (for testing)
router.get('/:id/email-preview', async (req, res) => {
  try {
    const reservationId = req.params.id;
    
    if (!mongoose.Types.ObjectId.isValid(reservationId)) {
      return res.status(400).send('Invalid reservation ID');
    }

    const reservation = await Reservation.findById(reservationId).populate('room');
    
    if (!reservation) {
      return res.status(404).send('Reservation not found');
    }

    // Calculate nights for display
    const nights = Math.ceil((reservation.checkOut - reservation.checkIn) / (1000 * 60 * 60 * 24));

    // Format date for email
    function formatDateForEmail(date) {
      if (!date) return '';
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      }).replace(/\//g, '.');
    }

    // Generate email content
    const emailContent = `
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

    // Render as HTML page for preview
    res.render('email/preview', {
      title: 'Email Preview',
      reservation,
      nights,
      emailContent,
      formattedCheckIn: formatDateForEmail(reservation.checkIn),
      formattedCheckOut: formatDateForEmail(reservation.checkOut),
      currentDate: formatDateForEmail(new Date())
    });

  } catch (error) {
    console.error('Error generating email preview:', error);
    res.status(500).send('Server error');
  }
});

// POST /reservations/:id/send-test-email - Send test email to yourself
router.post('/:id/send-test-email', async (req, res) => {
  try {
    const reservationId = req.params.id;
    const testEmail = req.body.email || process.env.TEST_EMAIL;
    
    if (!testEmail) {
      return res.status(400).json({
        success: false,
        message: 'Test email address required'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(reservationId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reservation ID'
      });
    }

    const reservation = await Reservation.findById(reservationId).populate('room');
    
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    // Create a copy of reservation with test email
    const testReservation = {
      ...reservation.toObject(),
      guestEmail: testEmail
    };

    // Send to test email
    await sendReservationConfirmation(testReservation);
    
    res.json({
      success: true,
      message: `Test email sent to ${testEmail}`
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test email'
    });
  }
});

module.exports = router;