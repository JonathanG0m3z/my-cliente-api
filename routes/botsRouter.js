const express = require('express');
const router = express.Router();
const botsController = require('../controllers/botsController');
const { verifyToken } = require('../middlewares/jwtMiddleware');

router.post('/lattv', verifyToken, botsController.createLattvAccount);
router.post('/iptvPremiun', verifyToken, botsController.createIptvPremiunAccount);

module.exports = router;