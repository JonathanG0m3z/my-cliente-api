const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { verifyToken } = require('../middlewares/jwtMiddleware');

router.get('/', verifyToken, serviceController.getServices);
router.get('/combobox', verifyToken, serviceController.getServicesCombo);
router.post('/', verifyToken, serviceController.addService);
router.post('/:id', verifyToken, serviceController.updateService);
router.delete('/:id', verifyToken, serviceController.deleteService);

module.exports = router;