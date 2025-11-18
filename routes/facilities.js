const express = require('express');
const router = express.Router();

// Simple auth middleware
const auth = (req, res, next) => {
    if (!req.session.user) {
        req.flash('error', 'Please login to book facilities');
        return res.redirect('/login');
    }
    next();
};

// Import controller
const facilitiesController = require('../controllers/facilitiesController');

// Routes
router.get('/', facilitiesController.getFacilities);
router.post('/book', auth, facilitiesController.bookFacility);
router.get('/my-bookings', auth, facilitiesController.getMyBookings);
router.post('/cancel-booking/:id', auth, facilitiesController.cancelBooking);

// Test route
router.get('/test', (req, res) => {
    res.json({ message: 'Facilities routes are working!' });
});

module.exports = router;