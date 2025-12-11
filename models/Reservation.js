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
        enum: ['pending', 'confirmed', 'checked-in', 'completed', 'cancelled'], // ADDED 'checked-in' and 'completed'
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'paid', 'partially-paid', 'refunded'], // UPDATED with new values
        default: 'unpaid'
    },
    paymentMethod: String,
    receiptNumber: String,
    transactionNo: String,
    transactionId: String, // ADDED for consistency
    sessionId: String,
    bankName: String,
    cardType: String,
    notes: String,
    paidAt: Date,
    // New fields for check-in/check-out functionality
    actualCheckIn: Date,
    actualCheckOut: Date,
    checkedInBy: String,
    checkedOutBy: String,
    extraCharges: { type: Number, default: 0 },
    extraNights: { type: Number, default: 0 },
    earlyCheckoutReason: String,
    refundAmount: { type: Number, default: 0 },
    cancellationReason: String,
    cancelledBy: String,
    cancelledAt: Date,
    invoiceNumber: String,
    paymentConfirmedBy: String,
    paymentConfirmedAt: Date,
    paidAmount: { type: Number, default: 0 }
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

// Generate confirmation code
reservationSchema.pre('save', function(next) {
    if (!this.confirmationCode) {
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        this.confirmationCode = `FMH-${timestamp}${random}`;
    }
    next();
});

module.exports = mongoose.model('Reservation', reservationSchema);