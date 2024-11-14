const express = require('express');
const router = express.Router();
const setorController = require('../controllers/setorController');

router.post('/', setorController.createSetor);
router.get('/', setorController.getAllSetores);
router.get('/:id', setorController.getSetorById);   
router.put('/:id', setorController.updateSetor);
router.delete('/:id', setorController.deleteSetor);

module.exports = router;