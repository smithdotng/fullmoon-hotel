import mongoose from 'mongoose';
import crypto from 'crypto';

const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/, 'Please enter a valid email'],
    },
    subscribedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    source: { type: String, default: 'website' },
    unsubscribeToken: { type: String, unique: true, sparse: true },
    unsubscribedAt: Date,
    lastNotified: { type: Date },
    metadata: { type: Map, of: String, default: {} },
  },
  { timestamps: true }
);

subscriberSchema.pre('save', function (next) {
  if (!this.unsubscribeToken) this.unsubscribeToken = crypto.randomBytes(32).toString('hex');
  next();
});

subscriberSchema.index({ subscribedAt: -1 });
subscriberSchema.index({ isActive: 1 });

export default mongoose.models.Subscriber || mongoose.model('Subscriber', subscriberSchema);
