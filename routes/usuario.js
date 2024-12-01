import express from 'express';
import usuarioController from '../controllers/usuarioController.js';
import authenticateToken from '../middlewares/authenticateToken.js';

const router = express.Router();


// Aplicar `authenticateToken` para rotas que precisam de autenticação
router.use(authenticateToken);

router.put('/atualizar-perfil', usuarioController.updateProfile);
router.get('/getAllUsers', usuarioController.getAllUsers);

export default router;