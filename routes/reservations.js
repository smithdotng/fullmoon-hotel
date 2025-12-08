// routes/reservations.js
const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const mongoose = require('mongoose');

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

module.exports = router;