const express = require('express');
const router = express.Router();
const credencialController = require('../controllers/credencialController');

// Rotas básicas CRUD
router.post('/', credencialController.createCredencial);
router.get('/', credencialController.getAllCredenciais);
router.get('/:id', credencialController.getCredencialById);
router.put('/:id', credencialController.updateCredencial);
router.delete('/:id', credencialController.deleteCredencial);

// Rota para buscar credencial por pessoa e evento
router.get('/pessoa/:id/evento/:evento_id', credencialController.getCredencialByPessoaId);

module.exports = router;