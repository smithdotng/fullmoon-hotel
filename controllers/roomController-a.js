const Room = require('../models/Room');
const Reservation = require('../models/Reservation');

exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ available: true });
    res.render('rooms/list', { rooms, title: 'Available Rooms' });
  } catch (error) {
    res.status(500).render('error', { error: 'Failed to fetch rooms' });
  }
};

exports.getRoomDetails = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).render('error', { error: 'Room not found' });
    }
    res.render('rooms/details', { room, title: room.type + ' Room' });
  } catch (error) {
    res.status(500).render('error', { error: 'Failed to fetch room details' });
  }
};

exports.bookRoom = async (req, res) => {
  try {
    const { checkIn, checkOut, guests } = req.body;
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).render('error', { error: 'Room not found' });
    }

    const reservation = new Reservation({
      user: req.session.user._id,
      room: room._id,
      checkIn,
      checkOut,
      guests,
      totalAmount: room.price
    });

    await reservation.save();
    res.redirect('/rooms/my-bookings');
  } catch (error) {
    res.status(500).render('error', { error: 'Failed to book room' });
  }
};