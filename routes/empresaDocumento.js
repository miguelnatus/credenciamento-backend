const express = require('express');
const router = express.Router();
const empresaDocumentoController = require('../controllers/empresaDocumentoController');

router.post('/', empresaDocumentoController.createDocumentType);
router.get('/', empresaDocumentoController.getAllDocumentTypes);
router.get('/:id', empresaDocumentoController.getDocumentTypeById);
router.put('/:id', empresaDocumentoController.updateDocumentType);
router.delete('/:id', empresaDocumentoController.deleteDocumentType);

module.exports = router;
