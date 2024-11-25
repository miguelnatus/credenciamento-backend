const express = require('express');
const router = express.Router();
const credencialEmpresaController = require('../controllers/credencialEmpresaController');

router.post('/', credencialEmpresaController.createCredencialEmpresa);
router.get('/', credencialEmpresaController.getAllCredenciaisEmpresa);
router.get('/:id', credencialEmpresaController.getCredencialEmpresaById);   
router.put('/:id', credencialEmpresaController.updateCredencialEmpresa);
router.delete('/:id', credencialEmpresaController.deleteCredencialEmpresa);

module.exports = router;