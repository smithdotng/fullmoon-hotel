// app/models/Subscriber.js
const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    subscribedAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    },
    source: {
        type: String,
        default: 'website',
        enum: ['website', 'mobile', 'promotion', 'other']
    },
    unsubscribeToken: {
        type: String,
        unique: true,
        sparse: true
    },
    lastNotified: {
        type: Date
    },
    metadata: {
        type: Map,
        of: String,
        default: {}
    }
}, {
    timestamps: true
});

// Generate unsubscribe token before saving
subscriberSchema.pre('save', function(next) {
    if (!this.unsubscribeToken) {
        const crypto = require('crypto');
        this.unsubscribeToken = crypto.randomBytes(32).toString('hex');
    }
    next();
});

// Index for better query performance
subscriberSchema.index({ email: 1 }, { unique: true });
subscriberSchema.index({ subscribedAt: -1 });
subscriberSchema.index({ isActive: 1 });
subscriberSchema.index({ unsubscribeToken: 1 }, { sparse: true });

module.exports = mongoose.model('Subscriber', subscriberSchema);