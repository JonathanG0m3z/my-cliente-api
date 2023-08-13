const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const { verifyToken } = require('../middlewares/jwtMiddleware');

router.get('/', verifyToken, accountController.getAccounts);
router.post('/', verifyToken, accountController.addAccount);
router.get('/:id', verifyToken, accountController.getAccountById);
router.put('/:id', verifyToken, accountController.updateAccount);
router.delete('/:id', verifyToken, accountController.deleteAccount);

module.exports = router;