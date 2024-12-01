import express from 'express';
import { search } from '../controllers/buscaController.js'; // Importação corrigida para named exports

const router = express.Router();

// Rota para busca
router.get('/:busca/evento/:evento_id', search);

export default router;
