const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, // Appetizers, Main Course, Desserts, Beverages
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  available: { type: Boolean, default: true },
  ingredients: [String]
}, { timestamps: true });

module.exports = mongoose.model('Menu', menuSchema);