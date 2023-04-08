const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');
const verifyToken = require('../middlewares/jwtMiddleware');

router.get('/', verifyToken, saleController.getSales);
router.post('/', verifyToken, saleController.addSale);
router.get('/:id', verifyToken, saleController.getSaleById);
router.put('/:id', verifyToken, saleController.updateSale);
router.delete('/:id', verifyToken, saleController.deleteSale);

module.exports = router;