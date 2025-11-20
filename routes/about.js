const express = require('express');
const router = express.Router();

// GET /about - About page
router.get('/', (req, res) => {
    res.render('about', {
        title: 'About Us - Full Moon Hotels',
        description: 'Discover Full Moon Hotels Owerri - Luxury accommodation with premium amenities, exceptional service, and authentic Nigerian hospitality in the heart of Imo State.',
        url: '/about',
        user: req.user
    });
});

module.exports = router;