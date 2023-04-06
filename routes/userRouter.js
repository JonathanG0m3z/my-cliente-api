const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middlewares/jwtMiddleware');

router.get('/:id', verifyToken, userController.getUser);
router.post('/', userController.createUser);
router.post('/validate', userController.validateUser);

module.exports = router;