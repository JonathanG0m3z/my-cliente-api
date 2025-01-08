const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middlewares/jwtMiddleware');

router.get('/getUser/:id', verifyToken, userController.getUser);
router.post('/', userController.createUser);
router.post('/validate', userController.validateUser);
router.get('/logOut', verifyToken, userController.logOut);
router.post('/signin', userController.googleAuth);
router.get('/getBalance', verifyToken, userController.getBalanceById);
router.get('/getAdminBalance/:id', verifyToken, userController.getAdminBalance);
router.post('/updateBalance', verifyToken, userController.updateBalance);


module.exports = router;