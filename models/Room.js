// models/Room.js - Updated with capacity tracking
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },
  type: { 
    type: String, 
    required: true,
    enum: [
      'Penthouse Double Suite',
      'Penthouse Single Suite', 
      'Executive Room',
      'Deluxe Room',
      'Premiere Room'
    ]
  },
  category: { 
    type: String, 
    required: true,
    enum: [
      'penthouse-double',
      'penthouse-single', 
      'executive',
      'deluxe',
      'premiere'
    ]
  },
  price: { 
    type: Number, 
    required: true 
  },
  description: { 
    type: String 
  },
  amenities: [String],
  images: [String],
  available: { 
    type: Boolean, 
    default: true 
  },
  floor: {
    type: String,
    default: ''
  },
  maxGuests: {
    type: Number,
    default: 2
  }
}, { 
  timestamps: true 
});

// Index for faster queries
roomSchema.index({ type: 1, available: 1 });
roomSchema.index({ category: 1, available: 1 });

module.exports = mongoose.model('Room', roomSchema);