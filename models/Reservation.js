const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    guestName: { type: String, required: true },
    guestEmail: { type: String, required: true },
    guestPhone: { type: String, required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    nights: { type: Number, required: true },
    guests: { type: Number, required: true },
    roomRate: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'paid'],
        default: 'unpaid'
    },
    paymentMethod: String,
    receiptNumber: String,
    transactionNo: String,
    sessionId: String,
    bankName: String,
    cardType: String,
    notes: String,
    paidAt: Date
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for formatted check-in date
reservationSchema.virtual('formattedCheckIn').get(function() {
    if (!this.checkIn) return '';
    return this.checkIn.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
});

// Virtual for formatted check-out date
reservationSchema.virtual('formattedCheckOut').get(function() {
    if (!this.checkOut) return '';
    return this.checkOut.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
});

// Virtual for formatted created date
reservationSchema.virtual('formattedCreatedAt').get(function() {
    if (!this.createdAt) return '';
    return this.createdAt.toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
});

// Virtual for display check-in (more readable)
reservationSchema.virtual('displayCheckIn').get(function() {
    if (!this.checkIn) return '';
    return this.checkIn.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
});

// Virtual for display check-out (more readable)
reservationSchema.virtual('displayCheckOut').get(function() {
    if (!this.checkOut) return '';
    return this.checkOut.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
});

// Virtual for short date format (for tables)
reservationSchema.virtual('shortCheckIn').get(function() {
    if (!this.checkIn) return '';
    return this.checkIn.toLocaleDateString('en-GB');
});

// Virtual for short date format (for tables)
reservationSchema.virtual('shortCheckOut').get(function() {
    if (!this.checkOut) return '';
    return this.checkOut.toLocaleDateString('en-GB');
});

// In your Reservation schema, add this after the schema definition:
reservationSchema.virtual('formattedCreatedAt').get(function() {
  if (!this.createdAt) return '';
  return this.createdAt.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

reservationSchema.virtual('formattedCheckIn').get(function() {
  if (!this.checkIn) return '';
  return this.checkIn.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
});

reservationSchema.virtual('formattedCheckOut').get(function() {
  if (!this.checkOut) return '';
  return this.checkOut.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
});

module.exports = mongoose.model('Reservation', reservationSchema);