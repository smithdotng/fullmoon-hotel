// models/Room.js - Updated version
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  category: { type: String, required: true }, // New field: 'penthouse-single', 'penthouse-double', etc.
  price: { type: Number, required: true },
  description: { type: String },
  amenities: [String],
  images: [String],
  available: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);