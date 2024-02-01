const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { verifyToken } = require('../middlewares/jwtMiddleware');

router.get('/', verifyToken, serviceController.getServicesCombo);
router.post('/', verifyToken, serviceController.addService);
router.put('/:id', verifyToken, serviceController.updateService);
router.delete('/:id', verifyToken, serviceController.deleteService);

module.exports = router;