import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true, unique: true },
    type: {
      type: String,
      required: true,
      enum: ['Penthouse Double Suite', 'Penthouse Single Suite', 'Executive Room', 'Deluxe Room', 'Premiere Room'],
    },
    category: {
      type: String,
      required: true,
      enum: ['penthouse-double', 'penthouse-single', 'executive', 'deluxe', 'premiere'],
    },
    price: { type: Number, required: true },
    description: { type: String },
    amenities: [String],
    images: [String],
    available: { type: Boolean, default: true },
    floor: { type: String, default: '' },
    maxGuests: { type: Number, default: 2 },
    currentOccupancy: { type: Number, default: 0 },
    lastCleaned: Date,
  },
  { timestamps: true }
);

roomSchema.index({ type: 1, available: 1 });
roomSchema.index({ category: 1, available: 1 });

export default mongoose.models.Room || mongoose.model('Room', roomSchema);
