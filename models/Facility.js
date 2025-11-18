const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    type: {
        type: String,
        required: true,
        enum: ['dining', 'wellness', 'business', 'recreation', 'entertainment']
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    shortDescription: {
        type: String,
        trim: true,
        maxlength: 150
    },
    image: {
        type: String,
        default: '/assets/images/facility-default.jpg'
    },
    capacity: {
        type: Number,
        required: true,
        min: 1
    },
    operatingHours: {
        type: String,
        required: true
    },
    pricePerHour: {
        type: Number,
        default: 0,
        min: 0
    },
    requiresGuests: {
        type: Boolean,
        default: false
    },
    maxGuests: {
        type: Number,
        default: 1,
        min: 1
    },
    bookable: {
        type: Boolean,
        default: false
    },
    featured: {
        type: Boolean,
        default: false
    },
    available: {
        type: Boolean,
        default: true
    },
    amenities: [{
        type: String,
        trim: true
    }],
    location: {
        type: String,
        trim: true
    },
    contactInfo: {
        phone: String,
        email: String
    },
    rules: [{
        type: String,
        trim: true
    }]
}, {
    timestamps: true
});

// Index for efficient queries
facilitySchema.index({ type: 1, bookable: 1 });
facilitySchema.index({ featured: 1, available: 1 });

// Virtual for display price
facilitySchema.virtual('displayPrice').get(function() {
    return this.pricePerHour > 0 ? `₦${this.pricePerHour}/hour` : 'Free';
});

// Static method to get facilities by type
facilitySchema.statics.getByType = function(type) {
    return this.find({ type, available: true }).sort({ name: 1 });
};

// Static method to get bookable facilities
facilitySchema.statics.getBookable = function() {
    return this.find({ bookable: true, available: true }).sort({ name: 1 });
};

module.exports = mongoose.model('Facility', facilitySchema);