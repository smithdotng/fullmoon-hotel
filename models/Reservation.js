const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  guests: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'confirmed', enum: ['confirmed', 'cancelled'] },
  guestName: { type: String, required: true },
  guestEmail: { type: String, required: true },
  guestPhone: { type: String, required: true },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'partially_paid', 'paid', 'refunded'],
    default: 'unpaid'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'transfer', 'pos', 'card', null],
    default: null
  },
  receiptNumber: {
    type: String,
    default: null
  },
  transactionNo: {
    type: String,
    default: null
  },
  sessionId: {
    type: String,
    default: null
  },
  bankName: {
    type: String,
    default: null
  },
  proofOfPayment: {
    type: String,
    default: null
  },
  notes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);