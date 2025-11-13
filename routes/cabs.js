const express = require('express');
const router = express.Router();
const cabController = require('../controllers/cabcontroller');

router.get('/', cabController.getCabs);
router.post('/calculate-fare', cabController.calculateFare);

module.exports = router;