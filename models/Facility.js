const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // Spa, Gym, Pool, Conference Room
  description: { type: String },
  pricePerHour: { type: Number, required: true },
  capacity: { type: Number },
  available: { type: Boolean, default: true },
  images: [String],
  operatingHours: {
    open: String,
    close: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Facility', facilitySchema);