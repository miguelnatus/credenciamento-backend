const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const authenticateToken = require('../middlewares/authenticateToken');



// Aplicar `authenticateToken` para rotas que precisam de autenticação
router.use(authenticateToken);

// Outras rotas que exigem autenticação

router.put('/atualizar-perfil', usuarioController.updateProfile);
router.get('/getAllUsers', usuarioController.getAllUsers);

module.exports = router;
