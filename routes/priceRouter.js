const express = require('express');
const router = express.Router();
const userController = require('../controllers/priceController');
const verifyToken = require('../middlewares/jwtMiddleware');

router.get('/', verifyToken, userController.getPrices);
router.post('/', verifyToken, userController.addPrice);
router.get('/:id', verifyToken, userController.getPriceById);

module.exports = router;