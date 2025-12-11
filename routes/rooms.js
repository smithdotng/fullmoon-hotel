// routes/rooms.js - UPDATED WITH CAPACITY TRACKING AND PRICE SORTING
const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const Reservation = require('../models/Reservation');
const mongoose = require('mongoose');

console.log('=== ROUTES/ROOMS.JS LOADED WITH CAPACITY TRACKING ===');

// Room capacity limits based on your breakdown
const ROOM_CAPACITY = {
  'Penthouse Double Suite': 1,
  'Penthouse Single Suite': 2,
  'Executive Room': 9,
  'Deluxe Room': 37,
  'Premiere Room': 20
};

// Category mapping
const CATEGORY_MAP = {
  'penthouse-single': 'Penthouse Single Suite',
  'penthouse-double': 'Penthouse Double Suite',
  'executive': 'Executive Room',
  'deluxe': 'Deluxe Room',
  'premiere': 'Premiere Room'
};

// Helper function to extract date from HTML string
function extractDateFromHTML(htmlString) {
  if (!htmlString || typeof htmlString !== 'string') return null;
  
  // Extract day, month, year from HTML like: <span class=day>15</span> <span class=month>Dec</span> <span class=year>2025</span>
  const dayMatch = htmlString.match(/class=day>(\d+)<\/span>/);
  const monthMatch = htmlString.match(/class=month>([A-Za-z]+)<\/span>/);
  const yearMatch = htmlString.match(/class=year>(\d+)<\/span>/);
  
  if (dayMatch && monthMatch && yearMatch) {
    const day = parseInt(dayMatch[1], 10);
    const monthStr = monthMatch[1].toLowerCase();
    const year = parseInt(yearMatch[1], 10);
    
    const monthMap = {
      'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
      'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
    };
    
    const month = monthMap[monthStr];
    if (!isNaN(day) && month !== undefined && !isNaN(year)) {
      // Create date in local timezone at midnight
      const date = new Date(year, month, day);
      return date;
    }
  }
  
  // If not HTML, try regular parsing
  return parseCustomDate(htmlString);
}

// Enhanced date parser - FIXED for timezone issues
function parseCustomDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return null;
  
  // Strip HTML tags first
  const cleanDateStr = dateStr.replace(/<[^>]*>/g, '').trim();
  
  // Try ISO format first (YYYY-MM-DD)
  const isoParts = cleanDateStr.split('-');
  if (isoParts.length === 3) {
    const year = parseInt(isoParts[0], 10);
    const month = parseInt(isoParts[1], 10) - 1; // Month is 0-indexed
    const day = parseInt(isoParts[2], 10);
    
    if (!isNaN(year) && !isNaN(month) && !isNaN(day) && month >= 0 && month <= 11 && day >= 1 && day <= 31) {
      // Create date in UTC to avoid timezone issues
      const date = new Date(Date.UTC(year, month, day));
      return date;
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
      // Create date in UTC
      const date = new Date(Date.UTC(year, month, day));
      return date;
    }
  }
  
  // Try to parse as a regular date string
  const parsedDate = new Date(cleanDateStr);
  if (!isNaN(parsedDate.getTime())) {
    // Return date at midnight UTC
    return new Date(Date.UTC(
      parsedDate.getUTCFullYear(),
      parsedDate.getUTCMonth(),
      parsedDate.getUTCDate()
    ));
  }
  
  return null;
}

// Helper function to format date for display (local time)
function formatDateForDisplay(date) {
  if (!date) return '';
  // Convert UTC date to local date for display
  const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  return localDate.toISOString().split('T')[0];
}

// Helper function to format date for query parameters
function formatDateForQuery(date) {
  if (!date) return '';
  return date.toISOString().split('T')[0];
}

// ========================
// ROUTES
// ========================

// GET /rooms - Show all rooms (SORTED BY PRICE)
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find({ }).sort({ price: -1 }); // Sort by price ascending
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



// GET /rooms/category/:category - Category overview (SORTED BY PRICE)
router.get('/category/:category', async (req, res) => {
  try {
    const category = req.params.category;
    const exactType = CATEGORY_MAP[category.toLowerCase()];
    
    if (!exactType) {
      return res.status(404).render('error', {
        title: 'Category Not Found',
        error: `No room category found: ${category}`
      });
    }

    const rooms = await Room.find({
      type: exactType,
      available: true
    }).sort({ price: 1 }) // Sort by price ascending
      .sort({ roomNumber: 1 });

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

// POST /rooms/check-availability - WITH CAPACITY TRACKING AND PRICE SORTING
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

    const checkInDate = parseCustomDate(checkIn);
    const checkOutDate = parseCustomDate(checkOut);

    console.log('Parsed dates:', { 
      originalCheckIn: checkIn, 
      parsedCheckIn: checkInDate ? checkInDate.toISOString().split('T')[0] : 'INVALID',
      originalCheckOut: checkOut, 
      parsedCheckOut: checkOutDate ? checkOutDate.toISOString().split('T')[0] : 'INVALID'
    });

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

    // Get all generally available rooms - SORTED BY PRICE
    const allRooms = await Room.find({ available: true }).sort({ price: 1 });
    console.log(`Found ${allRooms.length} generally available rooms (sorted by price)`);

    // Get overlapping reservations
    const overlappingReservations = await Reservation.find({
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate },
      status: { $ne: 'cancelled' }
    });

    console.log(`Found ${overlappingReservations.length} overlapping reservations`);

    // Count booked rooms by type
    const bookedRoomsByType = {};
    
    // First, populate with all room types
    Object.keys(ROOM_CAPACITY).forEach(type => {
      bookedRoomsByType[type] = 0;
    });

    // Count booked rooms
    for (const reservation of overlappingReservations) {
      if (reservation.room && reservation.room.type) {
        const roomType = reservation.room.type;
        if (bookedRoomsByType[roomType] !== undefined) {
          bookedRoomsByType[roomType]++;
        }
      }
    }

    console.log('Booked rooms by type:', bookedRoomsByType);

    // Filter available rooms based on capacity
    const availableRooms = [];
    
    for (const room of allRooms) {
      const roomType = room.type;
      const totalCapacity = ROOM_CAPACITY[roomType] || 0;
      const currentlyBooked = bookedRoomsByType[roomType] || 0;
      
      // Check if room is already booked in this reservation period
      const isRoomBooked = overlappingReservations.some(res => 
        res.room && res.room._id.toString() === room._id.toString()
      );
      
      // Room is available if:
      // 1. Not specifically booked for these dates
      // 2. Total booked rooms of this type is less than capacity
      if (!isRoomBooked && currentlyBooked < totalCapacity) {
        availableRooms.push(room);
      }
    }

    console.log(`Found ${availableRooms.length} rooms available after capacity check`);
    
    // Sort available rooms by price (least to most expensive) - if not already sorted from query
    availableRooms.sort((a, b) => a.price - b.price);
    
    if (availableRooms.length > 0) {
      console.log('Available rooms price range:');
      console.log(`  Cheapest: ₦${availableRooms[0].price.toLocaleString()} (${availableRooms[0].type})`);
      console.log(`  Most expensive: ₦${availableRooms[availableRooms.length - 1].price.toLocaleString()} (${availableRooms[availableRooms.length - 1].type})`);
    }
    
    // Format dates for display
    const formatDateForDisplay = (date) => {
      if (!date) return '';
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const displayCheckIn = formatDateForDisplay(checkInDate);
    const displayCheckOut = formatDateForDisplay(checkOutDate);

    res.render('rooms/availability', {
      title: 'Available Rooms - Full Moon Hotels',
      rooms: availableRooms,
      checkIn: req.body.checkIn,
      checkOut: req.body.checkOut,
      guests: guests,
      adults: req.body.adults,
      children: req.body.children,
      infants: req.body.infants,
      displayCheckIn,
      displayCheckOut
    });

  } catch (error) {
    console.error('Availability check error:', error);
    req.flash('error', 'Failed to check availability');
    res.redirect('/rooms');
  }
});

// GET /rooms/booking-confirmation
// GET /rooms/booking-confirmation - FIXED DATE HANDLING
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

    // Parse dates from query parameters (should be YYYY-MM-DD format)
    const parseDateFromQuery = (dateStr) => {
      if (!dateStr) return null;
      const parts = dateStr.split('-');
      if (parts.length !== 3) return null;
      
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
      const day = parseInt(parts[2], 10);
      
      if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
      
      // Create date in local timezone
      return new Date(year, month, day);
    };

    const checkInDate = parseDateFromQuery(checkIn);
    const checkOutDate = parseDateFromQuery(checkOut);

    console.log('Confirmation parsed dates:', { 
      originalCheckIn: checkIn, 
      parsedCheckIn: checkInDate ? checkInDate.toDateString() : 'INVALID',
      originalCheckOut: checkOut, 
      parsedCheckOut: checkOutDate ? checkOutDate.toDateString() : 'INVALID'
    });

    if (!checkInDate || !checkOutDate) {
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

    console.log('Booking details:', {
      nights,
      pricePerNight: room.price,
      totalAmount: totalAmount
    });

    console.log('Rendering booking-confirmation.ejs template...');
    
    // Format dates for display
    const formatDateForDisplay = (date) => {
      if (!date) return '';
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const displayCheckIn = formatDateForDisplay(checkInDate);
    const displayCheckOut = formatDateForDisplay(checkOutDate);
    
    // Render the confirmation page
    res.render('rooms/booking-confirmation', {
      title: 'Confirm Booking - Full Moon Hotels',
      room,
      checkIn: checkIn, // Pass original YYYY-MM-DD for form
      checkOut: checkOut, // Pass original YYYY-MM-DD for form
      displayCheckIn, // For display only
      displayCheckOut, // For display only
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

// POST /rooms/book/:id
// POST /rooms/book/:id - FIXED
router.post('/book/:id', async (req, res) => {
  try {
    console.log('=== BOOKING REQUEST START ===');
    console.log('Request body:', req.body);
    const roomId = req.params.id;
    
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      console.log('Invalid room ID format');
      req.flash('error', 'Invalid room ID');
      return res.redirect('/rooms');
    }

    // Check for both formats - either direct 'guests' field or calculated from adults/children/infants
    let guests;
    
    if (req.body.guests) {
      // If guests is directly provided
      guests = parseInt(req.body.guests, 10);
    } else if (req.body.adults) {
      // If coming from availability form with adults/children/infants
      const adults = parseInt(req.body.adults || 0, 10);
      const children = parseInt(req.body.children || 0, 10);
      const infants = parseInt(req.body.infants || 0, 10);
      guests = adults + children + infants;
    } else {
      console.log('Missing guest information');
      req.flash('error', 'Please provide guest information');
      return res.redirect('/rooms');
    }

    const { checkIn, checkOut } = req.body;

    if (!checkIn || !checkOut || guests <= 0) {
      console.log('Missing required fields');
      req.flash('error', 'Please fill in all required fields');
      return res.redirect('/rooms');
    }

    // Use the HTML extraction function
    const checkInDate = extractDateFromHTML(checkIn);
    const checkOutDate = extractDateFromHTML(checkOut);

    console.log('Booking parsed dates:', { 
      originalCheckIn: checkIn, 
      parsedCheckIn: checkInDate ? checkInDate.toDateString() : 'INVALID',
      originalCheckOut: checkOut, 
      parsedCheckOut: checkOutDate ? checkOutDate.toDateString() : 'INVALID'
    });

    if (!checkInDate || !checkOutDate) {
      console.log('Invalid date format in booking request');
      req.flash('error', 'Invalid date format');
      return res.redirect('/rooms');
    }

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

    // Check capacity availability one more time
    const overlappingReservations = await Reservation.find({
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate },
      status: { $ne: 'cancelled' }
    }).populate('room');

    const bookedRoomsOfType = overlappingReservations.filter(
      res => res.room && res.room.type === room.type
    ).length;

    const roomCapacity = ROOM_CAPACITY[room.type] || 0;
    
    if (bookedRoomsOfType >= roomCapacity) {
      req.flash('error', `Sorry, all ${room.type} rooms are booked for the selected dates.`);
      return res.redirect('/rooms');
    }

    console.log('=== BOOKING REQUEST SUCCESS - Redirecting to confirmation ===');

    // Format dates as YYYY-MM-DD for the query string
    const formatDateForQuery = (date) => {
      if (!date) return '';
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const queryCheckIn = formatDateForQuery(checkInDate);
    const queryCheckOut = formatDateForQuery(checkOutDate);
    
    const redirectUrl = `/rooms/booking-confirmation?roomId=${roomId}&checkIn=${encodeURIComponent(queryCheckIn)}&checkOut=${encodeURIComponent(queryCheckOut)}&guests=${encodeURIComponent(guests)}`;
    console.log('Redirect URL:', redirectUrl);

    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Booking error:', error);
    req.flash('error', 'Failed to process booking. Please try again.');
    res.redirect('/rooms');
  }
});

// POST /rooms/confirm-booking - FIXED DATE HANDLING
router.post('/confirm-booking', async (req, res) => {
  try {
    console.log('=== CONFIRM BOOKING REQUEST START ===');
    console.log('Full request body:', req.body);

    const {
      roomId,
      checkIn,
      checkOut,
      guests,
      guestName,
      guestEmail,
      guestPhone
    } = req.body;

    // Debug: Check what values we're receiving
    console.log('Received values:', {
      roomId,
      checkIn,
      checkOut,
      guests,
      guestName,
      guestEmail,
      guestPhone
    });

    // Validate all required fields
    const missingFields = [];
    if (!roomId) missingFields.push('roomId');
    if (!checkIn) missingFields.push('checkIn');
    if (!checkOut) missingFields.push('checkOut');
    if (!guests) missingFields.push('guests');
    if (!guestName) missingFields.push('guestName');
    if (!guestEmail) missingFields.push('guestEmail');
    if (!guestPhone) missingFields.push('guestPhone');

    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields);
      req.flash('error', `Please fill in all required fields: ${missingFields.join(', ')}`);
      return res.redirect('/rooms/booking-confirmation?roomId=' + roomId + '&checkIn=' + checkIn + '&checkOut=' + checkOut + '&guests=' + guests);
    }

    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      console.log('Invalid room ID format:', roomId);
      req.flash('error', 'Invalid room ID format');
      return res.redirect('/rooms');
    }

    const room = await Room.findById(roomId);
    console.log('Room lookup result:', room ? `Found: ${room.type} (${room.roomNumber})` : 'NOT FOUND');
    
    if (!room) {
      console.log('Room not found in database');
      req.flash('error', 'Room no longer available');
      return res.redirect('/rooms');
    }

    if (!room.available) {
      req.flash('error', 'Sorry, this room is not available for booking');
      return res.redirect('/rooms');
    }

    // Parse dates from form (should be YYYY-MM-DD format)
    const parseDateFromForm = (dateStr) => {
      if (!dateStr) return null;
      const parts = dateStr.split('-');
      if (parts.length !== 3) return null;
      
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
      const day = parseInt(parts[2], 10);
      
      if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
      
      // Create date in local timezone
      return new Date(year, month, day);
    };

    const checkInDate = parseDateFromForm(checkIn);
    const checkOutDate = parseDateFromForm(checkOut);

    console.log('Confirm booking parsed dates:', { 
      originalCheckIn: checkIn, 
      parsedCheckIn: checkInDate ? checkInDate.toDateString() : 'INVALID',
      originalCheckOut: checkOut, 
      parsedCheckOut: checkOutDate ? checkOutDate.toDateString() : 'INVALID'
    });

    if (!checkInDate || !checkOutDate) {
      console.log('Invalid date format after parsing');
      req.flash('error', 'Invalid date format. Please select valid dates.');
      return res.redirect('/rooms/booking-confirmation?roomId=' + roomId + '&checkIn=' + checkIn + '&checkOut=' + checkOut + '&guests=' + guests);
    }

    // Final capacity check
    const overlappingReservations = await Reservation.find({
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate },
      status: { $ne: 'cancelled' }
    }).populate('room');

    const bookedRoomsOfType = overlappingReservations.filter(
      res => res.room && res.room.type === room.type
    ).length;

    const roomCapacity = ROOM_CAPACITY[room.type] || 0;
    
    if (bookedRoomsOfType >= roomCapacity) {
      req.flash('error', `Sorry, all ${room.type} rooms are now booked for the selected dates.`);
      return res.redirect('/rooms');
    }

    // Check if this specific room is already booked
    const roomOverlap = overlappingReservations.find(
      res => res.room && res.room._id.toString() === roomId
    );

    if (roomOverlap) {
      console.log('Found overlapping reservation for this room:', roomOverlap._id);
      req.flash('error', 'This specific room has been booked. Please choose another room.');
      return res.redirect('/rooms');
    }

    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalAmount = room.price * nights;

    console.log('Creating reservation:', {
      nights,
      pricePerNight: room.price,
      totalAmount: totalAmount
    });

    const reservation = new Reservation({
      room: room._id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: parseInt(guests),
      roomRate: room.price,
      nights: nights,
      totalAmount: totalAmount,
      guestName: guestName.trim(),
      guestEmail: guestEmail.trim(),
      guestPhone: guestPhone.trim(),
      status: 'pending',
      paymentStatus: 'unpaid',
      notes: 'Reservation created. Awaiting payment confirmation.'
    });

    console.log('Attempting to save reservation...');
    await reservation.save();
    console.log('Guest reservation created:', reservation._id);

    req.flash('success', `Reservation received! A confirmation has been sent to ${guestEmail}.`);
    
    console.log('=== CONFIRM BOOKING SUCCESS - Redirecting to guest reservation ===');
    console.log('Redirect URL will be:', `/rooms/guest-reservation/${reservation._id}`);
    
    res.redirect(`/rooms/guest-reservation/${reservation._id}`);

  } catch (error) {
    console.error('CONFIRM BOOKING ERROR DETAILS:', error);
    console.error('Error stack:', error.stack);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      console.log('Validation errors:', validationErrors);
      req.flash('error', `Validation error: ${validationErrors.join(', ')}`);
    } else {
      req.flash('error', `Booking failed: ${error.message}`);
    }
    
    const { roomId, checkIn, checkOut, guests } = req.body;
    return res.redirect(`/rooms/booking-confirmation?roomId=${roomId || ''}&checkIn=${checkIn || ''}&checkOut=${checkOut || ''}&guests=${guests || ''}`);
  }
});

// GET /rooms/:id - Single room detail
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
      room
    });
  } catch (error) {
    console.error('Error fetching room details:', error);
    res.status(500).render('error', {
      title: 'Server Error',
      error: 'Failed to load room details'
    });
  }
});

// GET /rooms/guest-reservation/:id
router.get('/guest-reservation/:id', async (req, res) => {
  try {
    console.log('=== GUEST RESERVATION ROUTE HIT ===');
    const reservationId = req.params.id;
    
    console.log('Looking for reservation:', reservationId);
    
    if (reservationId.match(/\.(ico|png|jpg|jpeg|gif|css|js)$/i)) {
      console.log('Skipping file request:', reservationId);
      return res.status(404).end();
    }
    
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

// ========================
// ADMIN ROUTES
// ========================

// GET /rooms/admin/reservations - View all reservations (admin only)
/* router.get('/admin/reservations', async (req, res) => {
  try {
    // Check if user is admin (you'll need to implement proper authentication)
    if (!req.session.user || (req.session.user.role !== 'admin' && req.session.user.role !== 'super-admin')) {
      req.flash('error', 'Admin access required');
      return res.redirect('/login');
    }

    const { status, payment, date, createdFrom, createdTo, search } = req.query;
    
    let filter = {};
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    if (payment && payment !== 'all') {
      filter.paymentStatus = payment;
    }
    
    // Filter by check-in date
    if (date) {
      const searchDate = new Date(date);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      filter.checkIn = { $gte: searchDate, $lt: nextDay };
    }
    
    // Filter by reservation creation date range
    if (createdFrom || createdTo) {
      filter.createdAt = {};
      
      if (createdFrom) {
        const fromDate = new Date(createdFrom);
        filter.createdAt.$gte = fromDate;
      }
      
      if (createdTo) {
        const toDate = new Date(createdTo);
        toDate.setDate(toDate.getDate() + 1); // Include the entire day
        filter.createdAt.$lt = toDate;
      }
    }
    
    // Search by guest details
    if (search) {
      filter.$or = [
        { guestName: { $regex: search, $options: 'i' } },
        { guestEmail: { $regex: search, $options: 'i' } },
        { guestPhone: { $regex: search, $options: 'i' } },
        { receiptNumber: { $regex: search, $options: 'i' } },
        { transactionNo: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Fetch reservations with room details
    const reservations = await Reservation.find(filter)
      .populate('room', 'roomNumber type')
      .sort({ createdAt: -1 })
      .lean();
    
    // Calculate dashboard stats
    const stats = {
      total: await Reservation.countDocuments(),
      pending: await Reservation.countDocuments({ status: 'pending' }),
      confirmed: await Reservation.countDocuments({ status: 'confirmed' }),
      cancelled: await Reservation.countDocuments({ status: 'cancelled' }),
      unpaid: await Reservation.countDocuments({ paymentStatus: 'unpaid' }),
      paid: await Reservation.countDocuments({ paymentStatus: 'paid' })
    };
    
    // Format dates for display
    const formattedReservations = reservations.map(res => {
      // Format check-in date
      const checkInDate = res.checkIn ? new Date(res.checkIn) : null;
      const formattedCheckIn = checkInDate ? checkInDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }) : 'N/A';
      
      // Format check-out date
      const checkOutDate = res.checkOut ? new Date(res.checkOut) : null;
      const formattedCheckOut = checkOutDate ? checkOutDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }) : 'N/A';
      
      // Format created date (reservation date)
      const createdDate = res.createdAt ? new Date(res.createdAt) : null;
      const formattedCreatedAt = createdDate ? createdDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) : 'N/A';
      
      return {
        ...res,
        formattedCheckIn,
        formattedCheckOut,
        formattedCreatedAt
      };
    });
    
    res.render('admin/reservations', {
      title: 'Manage Reservations - Admin',
      reservations: formattedReservations,
      stats,
      query: req.query,
      user: req.session.user,
      messages: req.flash()
    });
    
  } catch (error) {
    console.error('Error loading admin reservations:', error);
    req.flash('error', 'Failed to load reservations');
    res.redirect('/admin');
  }
}); */

// GET /rooms/admin/reservations/:id - View reservation details (admin)
router.get('/admin/reservations/:id', async (req, res) => {
  try {
    if (!req.session.user || (req.session.user.role !== 'admin' && req.session.user.role !== 'super-admin')) {
      req.flash('error', 'Admin access required');
      return res.redirect('/login');
    }

    const reservation = await Reservation.findById(req.params.id)
      .populate('room')
      .lean();
    
    if (!reservation) {
      req.flash('error', 'Reservation not found');
      return res.redirect('/rooms/admin/reservations');
    }
    
    // Format dates
    reservation.formattedCheckIn = new Date(reservation.checkIn).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    
    reservation.formattedCheckOut = new Date(reservation.checkOut).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    
    res.render('admin/reservation-details', {
      title: 'Reservation Details - Admin',
      reservation,
      user: req.session.user,
      messages: req.flash()
    });
    
  } catch (error) {
    console.error('Error loading reservation details:', error);
    req.flash('error', 'Failed to load reservation');
    res.redirect('/rooms/admin/reservations');
  }
}); 

// POST /rooms/admin/reservations/:id/confirm-payment - Confirm payment (admin) - FIXED VERSION
router.post('/admin/reservations/:id/confirm-payment', async (req, res) => {
  try {
    if (!req.session.user || (req.session.user.role !== 'admin' && req.session.user.role !== 'super-admin')) {
      req.flash('error', 'Admin access required');
      return res.redirect('/login');
    }

    const { 
      paymentMethod, 
      receiptNumber, 
      transferTransactionNo, 
      posTransactionNo, 
      sessionId, 
      bankName, 
      cardType, 
      notes 
    } = req.body;
    
    console.log('Payment confirmation data:', req.body);
    
    if (!paymentMethod) {
      req.flash('error', 'Payment method is required');
      return res.redirect(`/rooms/admin/reservations/${req.params.id}`);
    }
    
    const updateData = {
      paymentStatus: 'paid',
      paidAt: new Date(),
      paymentMethod: paymentMethod,
      status: 'confirmed',
      notes: (notes || '') + `\n[${new Date().toISOString()}] Payment confirmed by ${req.session.user.username} using ${paymentMethod}`
    };
    
    // Add method-specific fields
    if (paymentMethod === 'cash') {
      if (!receiptNumber) {
        req.flash('error', 'Receipt number is required for cash payment');
        return res.redirect(`/rooms/admin/reservations/${req.params.id}`);
      }
      updateData.receiptNumber = receiptNumber;
    } 
    else if (paymentMethod === 'transfer') {
      if (!bankName || !transferTransactionNo || !sessionId) {
        req.flash('error', 'Bank, transaction number, and session ID are required for transfer');
        return res.redirect(`/rooms/admin/reservations/${req.params.id}`);
      }
      updateData.bankName = bankName;
      updateData.transactionNo = transferTransactionNo; // Use the correct field name
      updateData.sessionId = sessionId;
    }
    else if (paymentMethod === 'pos') {
      if (!cardType || !posTransactionNo) {
        req.flash('error', 'Card type and transaction number are required for POS');
        return res.redirect(`/rooms/admin/reservations/${req.params.id}`);
      }
      updateData.cardType = cardType;
      updateData.transactionNo = posTransactionNo; // Use the correct field name
    }
    
    console.log('Updating reservation with:', updateData);
    
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('room');
    
    if (!reservation) {
      req.flash('error', 'Reservation not found');
      return res.redirect('/rooms/admin/reservations');
    }
    
    console.log(`Payment confirmed for reservation ${reservation._id} by ${req.session.user.username}`);
    
    req.flash('success', `Payment confirmed for ${reservation.guestName}. Reservation is now confirmed.`);
    res.redirect(`/rooms/admin/reservations/${req.params.id}`);
    
  } catch (error) {
    console.error('Error confirming payment:', error);
    req.flash('error', 'Failed to confirm payment: ' + error.message);
    res.redirect(`/rooms/admin/reservations/${req.params.id}`);
  }
});
 
// POST /rooms/admin/reservations/:id/update-status - Update reservation status (admin)
router.post('/admin/reservations/:id/update-status', async (req, res) => {
  try {
    if (!req.session.user || (req.session.user.role !== 'admin' && req.session.user.role !== 'super-admin')) {
      req.flash('error', 'Admin access required');
      return res.redirect('/login');
    }

    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      req.flash('error', 'Invalid status');
      return res.redirect('/rooms/admin/reservations');
    }

    await Reservation.findByIdAndUpdate(req.params.id, { status });
    
    req.flash('success', `Reservation status updated to ${status}`);
    res.redirect('/rooms/admin/reservations');
  } catch (error) {
    console.error('Error updating reservation status:', error);
    req.flash('error', 'Failed to update reservation status');
    res.redirect('/rooms/admin/reservations');
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
        category: room.category,
        price: room.price,
        available: room.available
      } : null
    });
  } catch (error) {
    console.error('Debug room error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Debug route to check capacity
router.get('/debug/capacity', async (req, res) => {
  try {
    const roomCounts = {};
    
    for (const [type, capacity] of Object.entries(ROOM_CAPACITY)) {
      const totalRooms = await Room.countDocuments({ type: type });
      const availableRooms = await Room.countDocuments({ type: type, available: true });
      
      roomCounts[type] = {
        capacity: capacity,
        totalInDatabase: totalRooms,
        available: availableRooms,
        booked: totalRooms - availableRooms
      };
    }
    
    res.json({
      roomCapacity: ROOM_CAPACITY,
      currentStatus: roomCounts
    });
  } catch (error) {
    console.error('Debug capacity error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;