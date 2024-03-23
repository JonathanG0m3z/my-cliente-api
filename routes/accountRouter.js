const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const { verifyToken } = require('../middlewares/jwtMiddleware');

router.get('/', verifyToken, accountController.getAccounts);
router.post('/', verifyToken, accountController.addAccount);
router.get('/combobox', verifyToken, accountController.getAccountsCombo);
router.get('/:id', verifyToken, accountController.getAccountById);
router.post('/:id', verifyToken, accountController.updateAccount);
router.delete('/:id', verifyToken, accountController.deleteAccount);
router.post('/renew/:id', verifyToken, accountController.renewAccount);

module.exports = router;