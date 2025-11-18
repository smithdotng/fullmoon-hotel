const FacilityBooking = require('../models/FacilityBooking');
const Facility = require('../models/Facility'); // Add this import

// Facility data
const facilityData = {
    'Spa & Wellness Center': {
        name: 'Spa & Wellness Center',
        type: 'wellness',
        description: 'Luxurious treatments for relaxation and rejuvenation',
        image: '/assets/images/facility-spa.jpg',
        capacity: 20,
        operatingHours: '9:00 AM - 9:00 PM',
        pricePerHour: 50,
        requiresGuests: true,
        maxGuests: 10,
        bookable: true
    },
    'Business Center': {
        name: 'Business Center',
        type: 'business',
        description: 'Fully equipped business facilities and meeting rooms',
        image: '/assets/images/facility-business.jpg',
        capacity: 50,
        operatingHours: '24/7',
        pricePerHour: 30,
        requiresGuests: false,
        maxGuests: 1,
        bookable: true
    },
    'Event Spaces': {
        name: 'Event Spaces',
        type: 'business',
        description: 'Elegant venues for conferences and special events',
        image: '/assets/images/facility-event.jpg',
        capacity: 200,
        operatingHours: 'Custom',
        pricePerHour: 100,
        requiresGuests: true,
        maxGuests: 200,
        bookable: true
    }
};

// Controller methods
exports.getFacilities = async (req, res) => {
    try {
        const allFacilities = [
            {
                name: 'Main Restaurant',
                type: 'dining',
                description: 'Fine dining experience with international cuisine',
                image: '/assets/images/restaurant-main.jpg',
                capacity: 100,
                operatingHours: '6:00 AM - 11:00 PM',
                bookable: false
            },
            {
                name: 'Fitness Center',
                type: 'wellness',
                description: 'State-of-the-art gym equipment and training area',
                image: '/assets/images/facility-gym.jpg',
                capacity: 30,
                operatingHours: '24/7',
                bookable: false
            },
            {
                name: 'Swimming Pool',
                type: 'recreation',
                description: 'Outdoor swimming pool with lounge area',
                image: '/assets/images/facility-pool.jpg',
                capacity: 40,
                operatingHours: '7:00 AM - 10:00 PM',
                bookable: false
            },
            ...Object.values(facilityData)
        ];

        // Create array of bookable facility names for the view
        const bookableFacilityNames = Object.keys(facilityData);

        res.render('facilities/index', {
            title: 'Hotel Facilities - Full Moon Hotels',
            description: 'Explore our premium facilities',
            facilities: allFacilities,
            bookableFacilities: bookableFacilityNames, // Now it's an array
            facilityData: facilityData, // Keep the object for pricing info
            user: req.user
        });
    } catch (error) {
        console.error('Error loading facilities:', error);
        res.status(500).render('error', {
            title: 'Server Error',
            error: 'Failed to load facilities page'
        });
    }
};

exports.bookFacility = async (req, res) => {
    try {
        const { facilityName, bookingDate, bookingTime, duration, guests, specialRequests } = req.body;
        
        console.log('Booking request:', {
            facilityName,
            bookingDate,
            bookingTime,
            duration,
            guests,
            specialRequests
        });

        // Basic validation
        if (!facilityName || !bookingDate || !bookingTime || !duration) {
            req.flash('error', 'Please fill in all required fields');
            return res.redirect('/facilities');
        }

        // Check if facility exists and is bookable
        const facility = facilityData[facilityName];
        if (!facility || !facility.bookable) {
            req.flash('error', 'Selected facility is not available for booking');
            return res.redirect('/facilities');
        }

        // Calculate total amount
        const totalAmount = facility.pricePerHour * parseInt(duration);

        req.flash('success', `Your ${facilityName} booking has been confirmed! Total: ₦${totalAmount}`);
        res.redirect('/facilities');
    } catch (error) {
        console.error('Booking error:', error);
        req.flash('error', 'Failed to process booking');
        res.redirect('/facilities');
    }
};

exports.getMyBookings = async (req, res) => {
    try {
        res.render('facilities/my-bookings', {
            title: 'My Facility Bookings - Full Moon Hotels',
            bookings: [],
            user: req.user
        });
    } catch (error) {
        console.error('Error getting bookings:', error);
        req.flash('error', 'Failed to load bookings');
        res.redirect('/facilities');
    }
};

exports.cancelBooking = async (req, res) => {
    try {
        req.flash('success', 'Booking cancelled successfully');
        res.redirect('/facilities/my-bookings');
    } catch (error) {
        console.error('Cancel error:', error);
        req.flash('error', 'Failed to cancel booking');
        res.redirect('/facilities/my-bookings');
    }
};