const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { verifyToken } = require('../middlewares/jwtMiddleware');

router.get('/', verifyToken, clientController.getClients);
router.post('/', verifyToken, clientController.addClient);
router.get('/combobox', verifyToken, clientController.getClientsCombobox);
router.get('/:id', verifyToken, clientController.getClientById);
router.put('/:id', verifyToken, clientController.updateClient);
router.delete('/:id', verifyToken, clientController.deleteClient);

module.exports = router;