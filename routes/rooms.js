// routes/rooms.js - UPDATED WITH ALL ROOMS AS CLASSES
const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const Reservation = require('../models/Reservation');
const mongoose = require('mongoose');
const { sendReservationConfirmation } = require('../utils/emailService');

console.log('=== ROUTES/ROOMS.JS LOADED WITH ALL ROOMS AS CLASSES ===');

// Room capacity limits based on your breakdown - ALL are classes
const ROOM_CAPACITY = {
  'Penthouse Double Suite': 1,
  'Penthouse Single Suite': 2,
  'Executive Room': 9,
  'Deluxe Room': 37,
  'Premiere Room': 20
};

// ALL rooms are treated as classes
const ALL_ROOMS_ARE_CLASSES = true;

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
      const date = new Date(year, month, day);
      return date;
    }
  }
  
  return parseCustomDate(htmlString);
}

// Enhanced date parser
function parseCustomDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return null;
  
  const cleanDateStr = dateStr.replace(/<[^>]*>/g, '').trim();
  
  const isoParts = cleanDateStr.split('-');
  if (isoParts.length === 3) {
    const year = parseInt(isoParts[0], 10);
    const month = parseInt(isoParts[1], 10) - 1;
    const day = parseInt(isoParts[2], 10);
    
    if (!isNaN(year) && !isNaN(month) && !isNaN(day) && month >= 0 && month <= 11 && day >= 1 && day <= 31) {
      const date = new Date(Date.UTC(year, month, day));
      return date;
    }
  }
  
  const customParts = cleanDateStr.split(/\s+/);
  if (customParts.length === 3) {
    const day = parseInt(customParts[0], 10);
    const monthStr = customParts[1].toLowerCase();
    let year = parseInt(customParts[2], 10);
    
    if (year < 100) {
      year += 2000;
    }
    
    const monthMap = {
      'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
      'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
    };
    
    const month = monthMap[monthStr];
    if (!isNaN(day) && month !== undefined && !isNaN(year) && day >= 1 && day <= 31) {
      const date = new Date(Date.UTC(year, month, day));
      return date;
    }
  }
  
  const parsedDate = new Date(cleanDateStr);
  if (!isNaN(parsedDate.getTime())) {
    return new Date(Date.UTC(
      parsedDate.getUTCFullYear(),
      parsedDate.getUTCMonth(),
      parsedDate.getUTCDate()
    ));
  }
  
  return null;
}

// Helper function to get available rooms with ALL rooms as classes
async function getAvailableRoomsWithClassLogic(checkInDate, checkOutDate) {
  console.log('=== GETTING AVAILABLE ROOMS WITH ALL ROOMS AS CLASSES ===');
  
  // Get all generally available rooms
  const allRooms = await Room.find({ available: true }).sort({ price: 1 });
  console.log(`Found ${allRooms.length} generally available rooms`);
  
  // Get overlapping reservations
  const overlappingReservations = await Reservation.find({
    checkIn: { $lt: checkOutDate },
    checkOut: { $gt: checkInDate },
    status: { $ne: 'cancelled' }
  }).populate('room');
  
  console.log(`Found ${overlappingReservations.length} overlapping reservations`);
  
  // Group rooms by type
  const roomsByType = {};
  allRooms.forEach(room => {
    if (!roomsByType[room.type]) {
      roomsByType[room.type] = [];
    }
    roomsByType[room.type].push(room);
  });
  
  // Count booked rooms by type
  const bookedRoomsByType = {};
  Object.keys(ROOM_CAPACITY).forEach(type => {
    bookedRoomsByType[type] = 0;
  });
  
  // Count booked rooms from reservations
  for (const reservation of overlappingReservations) {
    if (reservation.room && reservation.room.type) {
      const roomType = reservation.room.type;
      if (bookedRoomsByType[roomType] !== undefined) {
        bookedRoomsByType[roomType]++;
      }
    }
  }
  
  console.log('Booked rooms by type:', bookedRoomsByType);
  console.log('All rooms are treated as classes:', ALL_ROOMS_ARE_CLASSES);
  
  // Filter available rooms - ALL rooms use class logic
  const availableRooms = [];
  
  for (const room of allRooms) {
    const roomType = room.type;
    const totalCapacity = ROOM_CAPACITY[roomType] || 0;
    const currentlyBooked = bookedRoomsByType[roomType] || 0;
    
    // ALL ROOMS USE CLASS LOGIC
    // We only care about the total capacity
    // Any room of this type can be booked as long as total capacity isn't exceeded
    
    if (currentlyBooked < totalCapacity) {
      availableRooms.push(room);
    } else {
      console.log(`Room class ${roomType} is at capacity: ${currentlyBooked}/${totalCapacity} booked`);
    }
  }
  
  console.log(`Found ${availableRooms.length} available rooms after applying class logic`);
  
  // Sort by price (least to most expensive)
  availableRooms.sort((a, b) => a.price - b.price);
  
  return availableRooms;
}

// Helper function to check if a specific room can be booked with class logic
async function canBookRoomWithClassLogic(roomId, checkInDate, checkOutDate) {
  const room = await Room.findById(roomId);
  if (!room) return { canBook: false, reason: 'Room not found' };
  
  if (!room.available) {
    return { canBook: false, reason: 'Room is not available' };
  }
  
  const roomType = room.type;
  
  // Get overlapping reservations
  const overlappingReservations = await Reservation.find({
    checkIn: { $lt: checkOutDate },
    checkOut: { $gt: checkInDate },
    status: { $ne: 'cancelled' }
  }).populate('room');
  
  // Count booked rooms of this type
  const bookedRoomsOfType = overlappingReservations.filter(
    res => res.room && res.room.type === roomType
  ).length;
  
  const roomCapacity = ROOM_CAPACITY[roomType] || 0;
  
  // ALL ROOMS USE CLASS LOGIC - only check capacity
  if (bookedRoomsOfType >= roomCapacity) {
    return { 
      canBook: false, 
      reason: `All ${roomType} rooms are booked for the selected dates.`,
      details: {
        booked: bookedRoomsOfType,
        capacity: roomCapacity,
        available: roomCapacity - bookedRoomsOfType
      }
    };
  }
  
  return { canBook: true };
}

// ========================
// ROUTES
// ========================

// GET /rooms - Show ALL rooms (available and unavailable), sorted by price descending
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find({}).sort({ price: -1 });
    
    console.log(`Fetched ${rooms.length} total rooms from database`);
    
    // Log room counts by type
    Object.keys(ROOM_CAPACITY).forEach(className => {
      const classRooms = rooms.filter(r => r.type === className);
      console.log(`${className}: ${classRooms.length} rooms (capacity: ${ROOM_CAPACITY[className]})`);
    });
    
    res.render('rooms/index', {
      title: 'All Rooms & Suites - Full Moon Hotels',
      rooms: rooms,
      showAllRooms: true,
      roomCapacity: ROOM_CAPACITY
    });
  } catch (error) {
    console.error('Error fetching all rooms:', error);
    res.status(500).render('error', {
      title: 'Server Error',
      error: 'Failed to load rooms'
    });
  }
});

// GET /rooms/category/:category - Shows ALL rooms in category (available or not)
router.get('/category/:category', async (req, res) => {
  try {
    const category = req.params.category.toLowerCase();
    
    console.log(`=== CATEGORY ROUTE: Looking for "${category}" ===`);
    
    const urlToRoomTypeMap = {
      'premiere': 'Premiere Room',
      'deluxe': 'Deluxe Room', 
      'executive': 'Executive Room',
      'penthouse-single': 'Penthouse Single Suite',
      'penthouse-double': 'Penthouse Double Suite',
      'annex': 'Annex Room'
    };
    
    const roomType = urlToRoomTypeMap[category];
    
    if (!roomType) {
      console.log(`Invalid category requested: ${category}`);
      
      const distinctTypes = await Room.distinct('type');
      const suggestions = distinctTypes.map(type => {
        const slug = type.toLowerCase().replace(/\s+/g, '-');
        return `<a href="/rooms/category/${slug}">${type}</a>`;
      });
      
      return res.status(404).render('error', {
        title: 'Category Not Found',
        error: `Invalid category: ${category}`,
        suggestions: `Available categories: ${suggestions.join(', ')}`
      });
    }
    
    console.log(`Searching for ALL rooms of type: "${roomType}"`);
    
    const rooms = await Room.find({
      type: roomType
    }).sort({ price: 1, roomNumber: 1 });

    console.log(`Found ${rooms.length} ${roomType} rooms (including unavailable)`);
    
    if (rooms.length === 0) {
      return res.status(404).render('error', {
        title: 'No Rooms Found',
        error: `No ${roomType} rooms exist in the database.`
      });
    }
    
    const availableRooms = rooms.filter(r => r.available);
    const unavailableRooms = rooms.filter(r => !r.available);
    
    console.log(`Available: ${availableRooms.length}, Unavailable: ${unavailableRooms.length}`);
    console.log(`Capacity: ${ROOM_CAPACITY[roomType]} rooms total`);
    
    const displayName = roomType;
    
    console.log(`✓ Rendering ${rooms.length} ${displayName} rooms (all rooms are classes)`);
    
    res.render('rooms/category', {
      title: `${displayName} - Full Moon Hotels`,
      rooms,
      category: displayName,
      totalRooms: rooms.length,
      availableCount: availableRooms.length,
      unavailableCount: unavailableRooms.length,
      hasAvailableRooms: availableRooms.length > 0,
      roomCapacity: ROOM_CAPACITY[roomType] || 0
    });
    
  } catch (error) {
    console.error('Error fetching rooms by category:', error);
    res.status(500).render('error', {
      title: 'Server Error',
      error: 'Failed to load room category: ' + error.message
    });
  }
});

// POST /rooms/check-availability - WITH ALL ROOMS AS CLASSES
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

    // Get available rooms using class-based logic (all rooms are classes)
    const availableRooms = await getAvailableRoomsWithClassLogic(checkInDate, checkOutDate);
    
    if (availableRooms.length > 0) {
      console.log('Available rooms price range:');
      console.log(`  Cheapest: ₦${availableRooms[0].price.toLocaleString()} (${availableRooms[0].type})`);
      console.log(`  Most expensive: ₦${availableRooms[availableRooms.length - 1].price.toLocaleString()} (${availableRooms[availableRooms.length - 1].type})`);
      
      // Group by room type for logging
      const byType = {};
      availableRooms.forEach(room => {
        if (!byType[room.type]) byType[room.type] = 0;
        byType[room.type]++;
      });
      console.log('Available by type:', byType);
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
      displayCheckOut,
      roomCapacity: ROOM_CAPACITY
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

    if (!roomId || !checkIn || !checkOut || !guests) {
      console.log('Missing required parameters');
      req.flash('error', 'Missing booking details. Please start over.');
      return res.redirect('/rooms');
    }

    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      console.log('Invalid ObjectId format:', roomId);
      req.flash('error', 'Invalid room ID format');
      return res.redirect('/rooms');
    }

    const parseDateFromQuery = (dateStr) => {
      if (!dateStr) return null;
      const parts = dateStr.split('-');
      if (parts.length !== 3) return null;
      
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      
      if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
      
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

    console.log('Looking for room with ID:', roomId);
    const room = await Room.findById(roomId);
    console.log('Room found:', room ? `Yes - ${room.type} (${room.roomNumber})` : 'NO');

    if (!room) {
      console.log('Room not found in database');
      req.flash('error', 'The requested room was not found in our system.');
      return res.redirect('/rooms');
    }

    // Check if room can be booked with class logic
    const bookingCheck = await canBookRoomWithClassLogic(roomId, checkInDate, checkOutDate);
    if (!bookingCheck.canBook) {
      req.flash('error', bookingCheck.reason);
      return res.redirect('/rooms');
    }

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
      totalAmount: totalAmount,
      roomType: room.type,
      roomCapacity: ROOM_CAPACITY[room.type] || 0
    });

    console.log('Rendering booking-confirmation.ejs template...');
    
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
    
    res.render('rooms/booking-confirmation', {
      title: 'Confirm Booking - Full Moon Hotels',
      room,
      checkIn: checkIn,
      checkOut: checkOut,
      displayCheckIn,
      displayCheckOut,
      guests,
      nights,
      totalAmount,
      messages: req.flash(),
      roomCapacity: ROOM_CAPACITY[room.type] || 0
    });

  } catch (error) {
    console.error('CRITICAL ERROR in booking-confirmation route:', error);
    console.error('Error stack:', error.stack);
    req.flash('error', 'Server error while loading booking confirmation. Please try again.');
    res.redirect('/rooms');
  }
});

// POST /rooms/book/:id
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

    let guests;
    
    if (req.body.guests) {
      guests = parseInt(req.body.guests, 10);
    } else if (req.body.adults) {
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

    // Check if room can be booked with class logic
    const bookingCheck = await canBookRoomWithClassLogic(roomId, checkInDate, checkOutDate);
    if (!bookingCheck.canBook) {
      req.flash('error', bookingCheck.reason);
      return res.redirect('/rooms');
    }

    console.log('=== BOOKING REQUEST SUCCESS - Redirecting to confirmation ===');

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

// POST /rooms/confirm-booking
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

    console.log('Received values:', {
      roomId,
      checkIn,
      checkOut,
      guests,
      guestName,
      guestEmail,
      guestPhone
    });

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

    const parseDateFromForm = (dateStr) => {
      if (!dateStr) return null;
      const parts = dateStr.split('-');
      if (parts.length !== 3) return null;
      
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      
      if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
      
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

    // Final booking check with class logic
    const bookingCheck = await canBookRoomWithClassLogic(roomId, checkInDate, checkOutDate);
    if (!bookingCheck.canBook) {
      req.flash('error', bookingCheck.reason);
      return res.redirect('/rooms');
    }

    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalAmount = room.price * nights;

    console.log('Creating reservation:', {
      nights,
      pricePerNight: room.price,
      totalAmount: totalAmount,
      roomType: room.type,
      roomCapacity: ROOM_CAPACITY[room.type] || 0
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
      notes: `Reservation created. Class room booking (${room.type}). Awaiting payment confirmation.`
    });

    console.log('Attempting to save reservation...');
    await reservation.save();
    console.log('Guest reservation created:', reservation._id);

    // Send confirmation email
    try {
      console.log('Attempting to send confirmation email...');
      
      const populatedReservation = await Reservation.findById(reservation._id)
        .populate('room')
        .exec();
      
      if (!populatedReservation) {
        console.error('Could not populate reservation for email');
      } else {
        await sendReservationConfirmation(populatedReservation);
        console.log(`✅ Confirmation email sent successfully to: ${guestEmail}`);
        
        req.flash('success', `Reservation received! A confirmation email has been sent to ${guestEmail}.`);
      }
    } catch (emailError) {
      console.error('❌ Failed to send confirmation email:', emailError);
      req.flash('warning', `Reservation created successfully, but we couldn't send the confirmation email to ${guestEmail}. Please save your confirmation number: ${reservation.confirmationCode || reservation._id}`);
    }

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
      room,
      roomCapacity: ROOM_CAPACITY[room.type] || 0
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
      nights,
      roomCapacity: ROOM_CAPACITY[reservation.room?.type || '']
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
        available: room.available,
        capacity: ROOM_CAPACITY[room.type] || 0
      } : null
    });
  } catch (error) {
    console.error('Debug room error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Debug route to check capacity with class logic
router.get('/debug/capacity', async (req, res) => {
  try {
    const { checkIn, checkOut } = req.query;
    let checkInDate, checkOutDate;
    
    if (checkIn && checkOut) {
      checkInDate = parseCustomDate(checkIn);
      checkOutDate = parseCustomDate(checkOut);
    }
    
    const roomCounts = {};
    
    for (const [type, capacity] of Object.entries(ROOM_CAPACITY)) {
      const totalRooms = await Room.countDocuments({ type: type });
      const availableRooms = await Room.countDocuments({ type: type, available: true });
      
      let bookedRooms = 0;
      let availableForDates = null;
      
      if (checkInDate && checkOutDate) {
        const overlappingReservations = await Reservation.find({
          checkIn: { $lt: checkOutDate },
          checkOut: { $gt: checkInDate },
          status: { $ne: 'cancelled' }
        }).populate('room');
        
        bookedRooms = overlappingReservations.filter(
          res => res.room && res.room.type === type
        ).length;
        
        // ALL ROOMS USE CLASS LOGIC
        availableForDates = Math.max(0, capacity - bookedRooms);
      }
      
      roomCounts[type] = {
        capacity: capacity,
        totalInDatabase: totalRooms,
        generallyAvailable: availableRooms
      };
      
      if (checkInDate && checkOutDate) {
        roomCounts[type].bookedForDates = bookedRooms;
        roomCounts[type].availableForDates = availableForDates;
        roomCounts[type].checkIn = checkInDate.toISOString().split('T')[0];
        roomCounts[type].checkOut = checkOutDate.toISOString().split('T')[0];
      }
    }
    
    res.json({
      roomCapacity: ROOM_CAPACITY,
      note: "ALL rooms are treated as classes",
      currentStatus: roomCounts
    });
  } catch (error) {
    console.error('Debug capacity error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;