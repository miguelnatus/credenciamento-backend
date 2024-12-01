import express from 'express';
import usuarioController from '../controllers/usuarioController.js';
import { authenticateToken } from '../middlewares/index.js';

const router = express.Router();

// Aplicar `authenticateToken` apenas às rotas protegidas
router.put('/atualizar-perfil', authenticateToken, usuarioController.updateProfile);
router.get('/getAllUsers', authenticateToken, usuarioController.getAllUsers);

export default router;
