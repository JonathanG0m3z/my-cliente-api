const express = require('express');
const router = express.Router();
const sharedBoardController = require('../controllers/sharedBoardController');
const { verifyToken } = require('../middlewares/jwtMiddleware');

router.get('/', verifyToken, sharedBoardController.getSharedBoards);
router.post('/', verifyToken, sharedBoardController.addSharedBoard);

module.exports = router;