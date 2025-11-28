// routes/laundry.js
const express = require('express');
const router = express.Router();

// GET /laundry - Laundry services page
router.get('/', (req, res) => {
    res.render('laundry', {
        title: 'Laundry & Dry Cleaning Services - Full Moon Hotels',
        description: 'Professional laundry and dry cleaning services at Full Moon Hotels Owerri. Fast, reliable, and premium quality cleaning for our guests.',
        url: '/laundry',
        user: req.user
    });
});

module.exports = router;