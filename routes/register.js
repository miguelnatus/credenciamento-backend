import express from 'express';
import registerUser from '../controllers/registerController.js';

const router = express.Router();

// Rota para registrar usuário
router.post('/', registerUser);

export default router;