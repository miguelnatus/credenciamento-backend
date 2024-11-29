const express = require('express');
const router = express.Router();
const buscaController = require('../controllers/buscaController');

router.get('/:busca/evento/:evento_id', buscaController.search);

module.exports = router;
