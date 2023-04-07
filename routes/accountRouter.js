const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const verifyToken = require('../middlewares/jwtMiddleware');

// router.get('/', verifyToken, accountController.getPrices);
router.post('/', verifyToken, accountController.addAccount);
// router.get('/:id', verifyToken, accountController.getPriceById);
// router.put('/:id', verifyToken, accountController.updatePrice);
// router.delete('/:id', verifyToken, accountController.deletePrice);

module.exports = router;