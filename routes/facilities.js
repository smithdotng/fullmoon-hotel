const express = require('express');
const router = express.Router();
const facilitiesController = require('../controllers/facilitiesController');
const auth = require('../middleware/auth');

router.get('/', facilitiesController.getFacilities);
router.post('/book', auth, facilitiesController.bookFacility);

module.exports = router;