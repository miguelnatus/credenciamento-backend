const express = require('express');
const router = express.Router();
const pessoaController = require('../controllers/pessoaController');



router.post('/', pessoaController.createPessoa);
router.get('/', pessoaController.getAllPessoas);
router.get('/:id', pessoaController.getPessoaById);
router.put('/:id', pessoaController.updatePessoa);
router.delete('/:id', pessoaController.deletePessoa);

module.exports = router;