const express = require('express');
const pessoaController = require('../controllers/pessoaController');

const router = express.Router();

router.post('/', pessoaController.createPessoa);
router.get('/', pessoaController.getAllPessoas);
router.get('/:id', pessoaController.getPessoaById);
router.put('/:id', pessoaController.updatePessoa);
router.delete('/:id', pessoaController.deletePessoa);

module.exports = router;