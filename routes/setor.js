import express from 'express';
import { createSetor, getAllSetores, getSetorById, updateSetor, deleteSetor } from '../controllers/setorController.js';

const router = express.Router();

// Rotas para manipulação de setores
router.post('/', createSetor);
router.get('/', getAllSetores);
router.get('/:id', getSetorById);
router.put('/:id', updateSetor);
router.delete('/:id', deleteSetor);

export default router;
