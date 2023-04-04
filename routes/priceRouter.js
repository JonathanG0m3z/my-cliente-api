const express = require('express');
const router = express.Router();
const userController = require('../controllers/priceController');

router.get('/', userController.getPrices);
router.post('/', userController.addPrice);

module.exports = router;