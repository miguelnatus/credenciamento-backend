import express from 'express';
import {
  getAllProdutoras,
  createProdutora,
  getProdutoraById,
  updateProdutora,
  deleteProdutora,
} from '../controllers/produtoraController.js';
import authenticateToken from '../middlewares/authenticateToken.js';
import verifyCsrfToken from '../middlewares/verifyCsrfToken.js';

const router = express.Router();

// Aplica autenticação e proteção CSRF apenas às rotas protegidas
router.get('/', authenticateToken, getAllProdutoras);
router.post('/', authenticateToken, verifyCsrfToken, createProdutora);
router.get('/:id', authenticateToken, getProdutoraById);
router.put('/:id', authenticateToken, verifyCsrfToken, updateProdutora);
router.delete('/:id', authenticateToken, verifyCsrfToken, deleteProdutora);

export default router;
