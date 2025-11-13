const mongoose = require('mongoose');

const cabSchema = new mongoose.Schema({
  type: { type: String, required: true }, // Sedan, SUV, Luxury
  name: { type: String, required: true },
  capacity: { type: Number, required: true },
  pricePerKm: { type: Number, required: true },
  available: { type: Boolean, default: true },
  image: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Cab', cabSchema);