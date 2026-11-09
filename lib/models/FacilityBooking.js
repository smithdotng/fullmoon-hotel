import mongoose from 'mongoose';

const facilityBookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    facilityName: { type: String, required: true, trim: true },
    bookingDate: { type: String, required: true },
    bookingTime: { type: String, required: true },
    duration: { type: Number, required: true, min: 1, max: 8 },
    guests: { type: Number, default: 1, min: 1 },
    specialRequests: { type: String, trim: true, maxlength: 500 },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'confirmed' },
    totalAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.FacilityBooking || mongoose.model('FacilityBooking', facilityBookingSchema);
