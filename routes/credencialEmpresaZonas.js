const express = require('express');
const router = express.Router();
const credencialEmpresaZonaController = require('../controllers/credencialEmpresaZonaController');

router.post('/', credencialEmpresaZonaController.createCredencialEmpresaZonas);
router.get('/', credencialEmpresaZonaController.getAllCredenciaisEmpresaZonas);
router.get('/:ces_id', credencialEmpresaZonaController.searchCredenciaisEmpresaZonas);
router.put('/:id', credencialEmpresaZonaController.updateCredencialEmpresaZonas);
router.delete('/:id', credencialEmpresaZonaController.deleteCredencialEmpresaZonas);

router.get('/mostraZonasDisponiveis/:ces_id', credencialEmpresaZonaController.mostraZonasDisponiveis);

module.exports = router;