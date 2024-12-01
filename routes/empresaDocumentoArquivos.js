const express = require('express');
const router = express.Router();
const empresaDocumentoArquivosController = require('../controllers/empresaDocumentoArquivosController');

// Rotas para gerenciar os arquivos de documentos das empresas
router.post('/', empresaDocumentoArquivosController.criarArquivo);
router.get('/', empresaDocumentoArquivosController.listarArquivos);
router.get('/:id', empresaDocumentoArquivosController.buscarArquivoPorId);
router.put('/:id', empresaDocumentoArquivosController.atualizarArquivo);
router.delete('/:id', empresaDocumentoArquivosController.deletarArquivo);

module.exports = router;
