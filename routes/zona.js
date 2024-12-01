import express from 'express';
import {
    createZona,
    getAllZonas,
    getZonaById,
    updateZona,
    deleteZona,
} from '../controllers/zonaController.js';

const router = express.Router();

router.post('/', createZona);
router.get('/', getAllZonas);
router.get('/:id', getZonaById);
router.put('/:id', updateZona);
router.delete('/:id', deleteZona);

export default router;
