const express = require('express');
const router = express.Router();
const zonaController = require('../controllers/zonaController');

router.post('/', zonaController.createZona);
router.get('/', zonaController.getAllZonas);
router.get('/:id', zonaController.getZonaById);   
router.put('/:id', zonaController.updateZona);
router.delete('/:id', zonaController.deleteZona);

module.exports = router;