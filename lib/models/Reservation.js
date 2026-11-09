import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema(
  {
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
      enum: ['pending', 'confirmed', 'checked-in', 'completed', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'partially-paid', 'refunded'],
      default: 'unpaid',
    },
    confirmationCode: { type: String, index: true },
    paymentMethod: String,
    receiptNumber: String,
    transactionNo: String,
    transactionId: String,
    sessionId: String,
    bankName: String,
    cardType: String,
    notes: String,
    paidAt: Date,
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
    paidAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Confirmation code, e.g. FMH-123456789 (now stored, so emails and search can use it)
reservationSchema.pre('save', function (next) {
  if (!this.confirmationCode) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.confirmationCode = `FMH-${timestamp}${random}`;
  }
  next();
});

export default mongoose.models.Reservation || mongoose.model('Reservation', reservationSchema);
