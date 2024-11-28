const express = require('express');
const router = express.Router();
const credencialZonaController = require('../controllers/credencialZonaController');

router.post('/', credencialZonaController.createCredencialZona);
router.get('/', credencialZonaController.getAllCredenciaisZonas);
router.get('/credencial/:credencial_id', credencialZonaController.getZonasByCredencialId);
router.put('/:id', credencialZonaController.updateCredencialZona);
router.delete('/:id', credencialZonaController.deleteCredencialZona);

module.exports = router;