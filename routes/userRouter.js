const userController = require('../controllers/userController');
const router = require('express').Router();

router.post('/addUser', userController);

module.exports = router;