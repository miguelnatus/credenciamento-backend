const express = require('express');
const router = express.Router();
const produtoraController = require('../controllers/produtoraController');

router.get('/', produtoraController.getAllProdutoras);
router.post('/', produtoraController.createProdutora);
router.get('/:id', produtoraController.getProdutoraById);
router.put('/:id', produtoraController.updateProdutora);
router.delete('/:id', produtoraController.deleteProdutora);

module.exports = router;