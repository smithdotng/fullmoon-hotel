// routes/rooms.js - FIXED VERSION
const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const Reservation = require('../models/Reservation');
const mongoose = require('mongoose');

console.log('=== ROUTES/ROOMS.JS LOADED ===');

// Enhanced date parser - handles ISO (YYYY-MM-DD), custom 'dd MM yy', and HTML stripping
function parseCustomDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return null;
  
  // Strip HTML tags first (e.g., <span class=day>19</span> -> 19)
  const cleanDateStr = dateStr.replace(/<[^>]*>/g, '').trim();
  
  // Try ISO format first (YYYY-MM-DD)
  const isoParts = cleanDateStr.split('-');
  if (isoParts.length === 3) {
    const year = parseInt(isoParts[0], 10);
    const month = parseInt(isoParts[1], 10);
    const day = parseInt(isoParts[2], 10);
    if (!isNaN(year) && !isNaN(month) && !isNaN(day) && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      const date = new Date(year, month - 1, day); // Month is 0-indexed
      if (date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day) {
        return date;
      }
    }
  }
  
  // Fallback to custom 'dd MM yy' format
  const customParts = cleanDateStr.split(/\s+/);
  if (customParts.length === 3) {
    const day = parseInt(customParts[0], 10);
    const monthStr = customParts[1].toLowerCase();
    let year = parseInt(customParts[2], 10);
    
    // Handle yy -> yyyy (assume 2000-2099)
    if (year < 100) {
      year += 2000;
    }
    
    const monthMap = {
      'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
      'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
    };
    
    const month = monthMap[monthStr];
    if (!isNaN(day) && month !== undefined && !isNaN(year) && day >= 1 && day <= 31) {
      const date = new Date(year, month, day);
      // Validate the parsed date
      if (date.getDate() === day && date.getMonth() === month && date.getFullYear() === year) {
        return date;
      }
    }
  }
  
  return null;
}

// ========================
// ROUTES IN CORRECT ORDER
// ========================

// GET /rooms - Show all rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find({ available: true });
    res.render('rooms/index', {
      title: 'Our Rooms - Full Moon Hotels',
      rooms
    });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).render('error', {
      title: 'Server Error',
      error: 'Failed to load rooms'
    });
  }
});

// GET /rooms/category/:category - Category overview (uses different template)
// GET /rooms/category/:category - Category overview (uses different template)
router.get('/category/:category', async (req, res) => {
  try {
    const category = req.params.category;
    
    // Map category names to exact room types
    const categoryMap = {
      'penthouse-single': 'Penthouse Single Suite',
      'penthouse-double': 'Penthouse Double Suite',
      'executive': 'Executive Room',
      'deluxe': 'Deluxe Room',
      'premiere': 'Premiere Room',
      'annex': 'Annex Room'
    };

    const exactType = categoryMap[category.toLowerCase()];
    
    if (!exactType) {
      return res.status(404).render('error', {
        title: 'Category Not Found',
        error: `No room category found: ${category}`
      });
    }

    const rooms = await Room.find({
      type: exactType,
      available: true
    }).sort({ roomNumber: 1 });

    if (rooms.length === 0) {
      return res.status(404).render('error', {
        title: 'Category Not Found',
        error: `No rooms found for category: ${category}`
      });
    }

    res.render('rooms/category', {
      title: `${exactType} - Full Moon Hotels`,
      rooms,
      category: exactType
    });
  } catch (error) {
    console.error('Error fetching rooms by category:', error);
    res.status(500).render('error', {
      title: 'Server Error',
      error: 'Failed to load room category'
    });
  }
});

// POST /rooms/check-availability
router.post('/check-availability', async (req, res) => {
  try {
    console.log('=== CHECK AVAILABILITY POST REQUEST ===');
    console.log('Request body:', req.body);

    const { checkIn, checkOut, adults, children, infants } = req.body;
    const guests = parseInt(adults || 0) + parseInt(children || 0) + parseInt(infants || 0);

    if (!checkIn || !checkOut || guests <= 0) {
      req.flash('error', 'Please fill in all required fields');
      return res.redirect('/rooms');
    }

    // Parse dates using enhanced parser
    const checkInDate = parseCustomDate(checkIn);
    const checkOutDate = parseCustomDate(checkOut);

    console.log('Parsed dates:', { 
      originalCheckIn: checkIn, 
      parsedCheckIn: checkInDate ? checkInDate.toISOString().split('T')[0] : 'INVALID',
      originalCheckOut: checkOut, 
      parsedCheckOut: checkOutDate ? checkOutDate.toISOString().split('T')[0] : 'INVALID'
    });

    // Validate parsed dates
    if (!checkInDate || !checkOutDate) {
      console.error('Invalid date format in request:', { checkIn, checkOut });
      req.flash('error', 'Invalid date format. Please select valid dates.');
      return res.redirect('/rooms');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      req.flash('error', 'Check-in date cannot be in the past');
      return res.redirect('/rooms');
    }

    if (checkOutDate <= checkInDate) {
      req.flash('error', 'Check-out date must be after check-in date');
      return res.redirect('/rooms');
    }

    const allRooms = await Room.find({ available: true });
    console.log(`Found ${allRooms.length} generally available rooms`);

    // Use parsed dates in query
    const overlappingReservations = await Reservation.find({
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate },
      status: { $ne: 'cancelled' }
    });

    const bookedRoomIds = new Set(overlappingReservations.map(r => r.room.toString()));
    const rooms = allRooms.filter(room => !bookedRoomIds.has(room._id.toString()));

    console.log(`Found ${rooms.length} rooms available for the selected dates`);

    // Pass formatted dates for display (ISO for consistency)
    const formattedCheckIn = checkInDate.toISOString().split('T')[0];
    const formattedCheckOut = checkOutDate.toISOString().split('T')[0];

    res.render('rooms/availability', {
      title: 'Available Rooms - Full Moon Hotels',
      rooms,
      checkIn: formattedCheckIn,
      checkOut: formattedCheckOut,
      guests
    });

  } catch (error) {
    console.error('Availability check error:', error);
    req.flash('error', 'Failed to check availability');
    res.redirect('/rooms');
  }
});

// GET /rooms/booking-confirmation
router.get('/booking-confirmation', async (req, res) => {
  try {
    console.log('=== BOOKING CONFIRMATION ROUTE HIT ===');
    const { roomId, checkIn, checkOut, guests } = req.query;

    console.log('Query parameters received:', {
      roomId,
      checkIn,
      checkOut,
      guests
    });

    // Validate required parameters
    if (!roomId || !checkIn || !checkOut || !guests) {
      console.log('Missing required parameters');
      req.flash('error', 'Missing booking details. Please start over.');
      return res.redirect('/rooms');
    }

    // Validate room ID format
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      console.log('Invalid ObjectId format:', roomId);
      req.flash('error', 'Invalid room ID format');
      return res.redirect('/rooms');
    }

    // Parse dates using enhanced parser
    const checkInDate = parseCustomDate(checkIn);
    const checkOutDate = parseCustomDate(checkOut);

    console.log('Confirmation parsed dates:', { 
      originalCheckIn: checkIn, 
      parsedCheckIn: checkInDate ? checkInDate.toISOString().split('T')[0] : 'INVALID',
      originalCheckOut: checkOut, 
      parsedCheckOut: checkOutDate ? checkOutDate.toISOString().split('T')[0] : 'INVALID'
    });

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      console.log('Invalid date format after parsing');
      req.flash('error', 'Invalid date format provided');
      return res.redirect('/rooms');
    }

    // Find the room
    console.log('Looking for room with ID:', roomId);
    const room = await Room.findById(roomId);
    console.log('Room found:', room ? `Yes - ${room.type} (${room.roomNumber})` : 'NO');

    if (!room) {
      console.log('Room not found in database');
      req.flash('error', 'The requested room was not found in our system.');
      return res.redirect('/rooms');
    }

    // Calculate stay details
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    
    if (nights <= 0) {
      console.log('Invalid stay duration:', nights);
      req.flash('error', 'Check-out date must be after check-in date');
      return res.redirect('/rooms');
    }

    const totalAmount = room.price * nights;

    console.log('Booking details calculated:', {
      nights,
      pricePerNight: room.price,
      totalAmount
    });

    console.log('Rendering booking-confirmation.ejs template...');
    
    // Render the confirmation page
    res.render('rooms/booking-confirmation', {
      title: 'Confirm Booking - Full Moon Hotels',
      room,
      checkIn: checkInDate.toISOString().split('T')[0],
      checkOut: checkOutDate.toISOString().split('T')[0],
      guests,
      nights,
      totalAmount,
      messages: req.flash()
    });

  } catch (error) {
    console.error('CRITICAL ERROR in booking-confirmation route:', error);
    console.error('Error stack:', error.stack);
    req.flash('error', 'Server error while loading booking confirmation. Please try again.');
    res.redirect('/rooms');
  }
});

// POST /rooms/book/:id - Forward to confirmation (no login)
router.post('/book/:id', async (req, res) => {
  try {
    console.log('=== BOOKING REQUEST START ===');
    console.log('Room ID:', req.params.id);
    console.log('Request body:', req.body);

    const roomId = req.params.id;
    
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      console.log('Invalid room ID format');
      req.flash('error', 'Invalid room ID');
      return res.redirect('/rooms');
    }

    const { checkIn, checkOut, guests } = req.body;

    if (!checkIn || !checkOut || !guests) {
      console.log('Missing required fields');
      req.flash('error', 'Please fill in all required fields');
      return res.redirect('/rooms');
    }

    // Parse dates using enhanced parser (handles ISO)
    const checkInDate = parseCustomDate(checkIn);
    const checkOutDate = parseCustomDate(checkOut);

    console.log('Booking parsed dates:', { 
      originalCheckIn: checkIn, 
      parsedCheckIn: checkInDate ? checkInDate.toISOString().split('T')[0] : 'INVALID',
      originalCheckOut: checkOut, 
      parsedCheckOut: checkOutDate ? checkOutDate.toISOString().split('T')[0] : 'INVALID'
    });

    if (!checkInDate || !checkOutDate) {
      console.log('Invalid date format in booking request');
      req.flash('error', 'Invalid date format');
      return res.redirect('/rooms');
    }

    // Verify room exists
    const room = await Room.findById(roomId);
    console.log('Room found:', room ? room._id : 'NOT FOUND');
    
    if (!room) {
      console.log('Room not found in database');
      req.flash('error', 'Room not found');
      return res.redirect('/rooms');
    }

    if (!room.available) {
      req.flash('error', 'Sorry, this room is not available for booking');
      return res.redirect('/rooms');
    }

    console.log('=== BOOKING REQUEST SUCCESS - Redirecting to confirmation ===');
    
    // Redirect to confirmation with ISO dates
    const isoCheckIn = checkInDate.toISOString().split('T')[0];
    const isoCheckOut = checkOutDate.toISOString().split('T')[0];
    const redirectUrl = `/rooms/booking-confirmation?roomId=${roomId}&checkIn=${encodeURIComponent(isoCheckIn)}&checkOut=${encodeURIComponent(isoCheckOut)}&guests=${encodeURIComponent(guests)}`;
    console.log('Redirect URL:', redirectUrl);
    
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Booking error:', error);
    req.flash('error', 'Failed to process booking. Please try again.');
    res.redirect('/rooms');
  }
});

// POST /rooms/confirm-booking - Finalize booking (guest)
router.post('/confirm-booking', async (req, res) => {
  try {
    const {
      roomId,
      checkIn,
      checkOut,
      guests,
      guestName,
      guestEmail,
      guestPhone
    } = req.body;

    console.log('=== CONFIRM BOOKING REQUEST ===');
    console.log('Request body:', req.body);

    if (!roomId || !checkIn || !checkOut || !guests || !guestName || !guestEmail || !guestPhone) {
      req.flash('error', 'Please fill in all guest information');
      return res.redirect('back');
    }

    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      req.flash('error', 'Invalid room');
      return res.redirect('/rooms');
    }

    const room = await Room.findById(roomId);
    if (!room || !room.available) {
      req.flash('error', 'Room no longer available');
      return res.redirect('/rooms');
    }

    // Parse dates using enhanced parser
    const checkInDate = parseCustomDate(checkIn);
    const checkOutDate = parseCustomDate(checkOut);

    console.log('Confirm booking parsed dates:', { 
      originalCheckIn: checkIn, 
      parsedCheckIn: checkInDate ? checkInDate.toISOString().split('T')[0] : 'INVALID',
      originalCheckOut: checkOut, 
      parsedCheckOut: checkOutDate ? checkOutDate.toISOString().split('T')[0] : 'INVALID'
    });

    if (!checkInDate || !checkOutDate) {
      req.flash('error', 'Invalid date format');
      return res.redirect('back');
    }

    // Check for overlapping reservations
    const overlap = await Reservation.findOne({
      room: roomId,
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate },
      status: { $ne: 'cancelled' }
    });

    if (overlap) {
      req.flash('error', 'Room has been booked for the selected dates. Please choose another room.');
      return res.redirect('/rooms');
    }

    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalAmount = room.price * nights;

    const reservation = new Reservation({
      room: room._id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: parseInt(guests),
      totalAmount,
      guestName: guestName.trim(),
      guestEmail: guestEmail.trim(),
      guestPhone: guestPhone.trim(),
      status: 'confirmed'
    });

    await reservation.save();
    console.log('Guest reservation created:', reservation._id);

    req.flash('success', `Booking confirmed! Reference: ${reservation._id}`);
    
    // FIXED: Redirect to the correct URL path
    res.redirect(`/reservations/guest/${reservation._id}`);

  } catch (error) {
    console.error('Confirm booking error:', error);
    req.flash('error', 'Booking failed. Please try again.');
    res.redirect('back');
  }
});

// GET /rooms/:id - Single room detail (MUST COME AFTER booking-confirmation)
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).render('error', {
        title: 'Room Not Found',
        error: 'The requested room was not found.'
      });
    }

    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).render('error', {
        title: 'Room Not Found',
        error: 'The requested room was not found.'
      });
    }

    res.render('rooms/detail', {
      title: `${room.type} - Full Moon Hotels`,
      room  // Single room object for detail view
    });
  } catch (error) {
    console.error('Error fetching room details:', error);
    res.status(500).render('error', {
      title: 'Server Error',
      error: 'Failed to load room details'
    });
  }
});

// ========================
// DEBUG ROUTES
// ========================

// Test route to verify booking-confirmation works
router.get('/test-booking-flow', async (req, res) => {
  try {
    const room = await Room.findOne({});
    if (!room) {
      return res.status(404).send('No rooms found in database');
    }

    console.log('Testing booking flow with room:', room._id);
    
    // Redirect to booking confirmation with test data (ISO format)
    res.redirect(`/rooms/booking-confirmation?roomId=${room._id}&checkIn=2025-11-14&checkOut=2025-11-16&guests=2`);
  } catch (error) {
    console.error('Test route error:', error);
    res.status(500).send('Test failed: ' + error.message);
  }
});

// Debug route to check room lookup
router.get('/debug/room/:id', async (req, res) => {
  try {
    const roomId = req.params.id;
    console.log('Debug room lookup for:', roomId);
    
    const room = await Room.findById(roomId);
    res.json({
      roomId,
      isValidObjectId: mongoose.Types.ObjectId.isValid(roomId),
      roomFound: !!room,
      room: room ? {
        _id: room._id,
        roomNumber: room.roomNumber,
        type: room.type,
        price: room.price,
        available: room.available
      } : null
    });
  } catch (error) {
    console.error('Debug room error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Debug route to check reservation
router.get('/debug/reservation/:id', async (req, res) => {
  try {
    const reservationId = req.params.id;
    console.log('Debug reservation lookup for:', reservationId);
    
    const reservation = await Reservation.findById(reservationId).populate('room');
    res.json({
      reservationId,
      isValidObjectId: mongoose.Types.ObjectId.isValid(reservationId),
      reservationFound: !!reservation,
      reservation: reservation ? {
        _id: reservation._id,
        guestName: reservation.guestName,
        guestEmail: reservation.guestEmail,
        checkIn: reservation.checkIn,
        checkOut: reservation.checkOut,
        room: reservation.room ? {
          _id: reservation.room._id,
          type: reservation.room.type,
          roomNumber: reservation.room.roomNumber
        } : null
      } : null
    });
  } catch (error) {
    console.error('Debug reservation error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;