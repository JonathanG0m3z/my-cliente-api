const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');
const { verifyToken } = require('../middlewares/jwtMiddleware');

router.get('/', verifyToken, saleController.getSales);
router.post('/', verifyToken, saleController.addSale);
router.get('/:id', verifyToken, saleController.getSaleById);
router.post('/:id', verifyToken, saleController.updateSale);
router.delete('/:id', verifyToken, saleController.deleteSale);
router.post('/renew/:id', verifyToken, saleController.renewSale);

module.exports = router;