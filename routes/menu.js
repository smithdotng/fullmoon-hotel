const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

router.get('/', menuController.getMenu);
router.get('/category/:category', menuController.getMenuByCategory);

module.exports = router;