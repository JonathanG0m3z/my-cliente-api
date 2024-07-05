const express = require('express');
const router = express.Router();
const botsController = require('../controllers/botsController');
const { verifyToken } = require('../middlewares/jwtMiddleware');

router.post('/lattv', verifyToken, botsController.createLattvAccount);

module.exports = router;