const express = require('express');
const router = express.Router();
const sharedBoardController = require('../controllers/sharedBoardController');
const { verifyToken } = require('../middlewares/jwtMiddleware');

router.get('/', verifyToken, sharedBoardController.getSharedBoards);
router.post('/', verifyToken, sharedBoardController.addSharedBoard);
router.post('/accounts', verifyToken, sharedBoardController.addAccount);
router.post('/accounts/:id', verifyToken, sharedBoardController.updateAccount);
router.delete('/accounts/:id', verifyToken, sharedBoardController.deleteAccount);
router.put('/accounts/:id', verifyToken, sharedBoardController.reactivateAccount);
router.get('/accounts/:sharedBoardId', verifyToken, sharedBoardController.getAccounts);
router.get('/renewIptvAccounts/:sharedBoardId', verifyToken, sharedBoardController.getAccountsToRenewIptv);

module.exports = router;