import express from 'express';
import {
    createDocumentType,
    getAllDocumentTypes,
    getDocumentTypeById,
    updateDocumentType,
    deleteDocumentType,
} from '../controllers/empresaDocumentoController.js';

const router = express.Router();

router.post('/', createDocumentType);
router.get('/', getAllDocumentTypes);
router.get('/:id', getDocumentTypeById);
router.put('/:id', updateDocumentType);
router.delete('/:id', deleteDocumentType);

export default router;
