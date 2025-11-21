const express = require('express');
const router = express.Router();

// GET /gallery - Gallery page
router.get('/', (req, res) => {
    res.render('gallery', {
        title: 'Photo Gallery - Full Moon Hotels',
        description: 'Explore our stunning photo gallery showcasing luxurious rooms, premium facilities, and beautiful spaces at Full Moon Hotels Owerri.',
        url: '/gallery',
        user: req.user
    });
});

module.exports = router;