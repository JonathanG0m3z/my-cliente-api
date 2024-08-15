const express = require('express');
const router = express.Router();
const binanceController = require('../controllers/binanceController');
const { verifyToken } = require('../middlewares/jwtMiddleware');

router.post('/buyOneService/iptvPemiun', verifyToken, binanceController.buyIptvPremiun);
router.post('/iptvPremiunWebhook', binanceController.iptvPremiunWebhook);


module.exports = router;