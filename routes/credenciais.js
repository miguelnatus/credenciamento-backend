const express = require('express');
const router = express.Router();
const credencialController = require('../controllers/credencialController');

router.post('/', credencialController.createCredencial);
router.get('/', credencialController.getAllCredenciais);
router.get('/:id', credencialController.getCredencialById);   
router.put('/:id', credencialController.updateCredencial);
router.delete('/:id', credencialController.deleteCredencial);

module.exports = router;