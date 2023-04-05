const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/:id', userController.getUser);
router.post('/', userController.createUser);
router.post('/validate', userController.validateUser);

module.exports = router;