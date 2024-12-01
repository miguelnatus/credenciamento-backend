import express from 'express';
import {
    createCredencialZona,
    getAllCredenciaisZonas,
    getZonasByCredencialId,
    updateCredencialZona,
    deleteCredencialZona,
} from '../controllers/credencialZonaController.js';

const router = express.Router();

router.post('/', createCredencialZona);
router.get('/', getAllCredenciaisZonas);
router.get('/credencial/:credencial_id', getZonasByCredencialId);
router.put('/:id', updateCredencialZona);
router.delete('/:id', deleteCredencialZona);

export default router;
