const express = require('express');
const router = express.Router();
const priceController = require('../controllers/priceController');
const verifyToken = require('../middlewares/jwtMiddleware');

router.get('/', verifyToken, priceController.getPrices);
router.post('/', verifyToken, priceController.addPrice);
router.get('/:id', verifyToken, priceController.getPriceById);
router.put('/:id', verifyToken, priceController.updatePrice);
router.delete('/:id', verifyToken, priceController.deletePrice);

module.exports = router;