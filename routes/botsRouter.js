const express = require('express');
const router = express.Router();
const botsController = require('../controllers/botsController');
const { verifyToken } = require('../middlewares/jwtMiddleware');

router.post('/lattv', verifyToken, botsController.createLattvAccount);
router.post('/iptvPremiun', verifyToken, botsController.createIptvPremiunAccount);
router.post('/iptvPremiun/renew', verifyToken, botsController.renewIptvPremiunAccount);

module.exports = router;