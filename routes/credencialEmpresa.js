const express = require('express');
const router = express.Router();
const credencialEmpresaController = require('../controllers/credencialEmpresaController');

router.post('/', credencialEmpresaController.createCredencialEmpresa);
router.get('/', credencialEmpresaController.getAllCredenciaisEmpresa);
router.get('/:empresa_id/:evento_id', credencialEmpresaController.searchCredenciaisEmpresa);
router.put('/:id', credencialEmpresaController.updateCredencialEmpresa);
router.delete('/:id', credencialEmpresaController.deleteCredencialEmpresa);

router.get('/mostraSetoresDisponiveis/:empresa_id/:evento_id', credencialEmpresaController.mostraSetoresDisponiveis);

module.exports = router;