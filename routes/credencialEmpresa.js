import express from 'express';
import {
    createCredencialEmpresa,
    getAllCredenciaisEmpresa,
    searchCredenciaisEmpresa,
    updateCredencialEmpresa,
    deleteCredencialEmpresa,
    mostraSetoresDisponiveis
} from '../controllers/credencialEmpresaController.js';

const router = express.Router();

router.post('/', createCredencialEmpresa);
router.get('/', getAllCredenciaisEmpresa);
router.get('/:empresa_id/:evento_id', searchCredenciaisEmpresa);
router.put('/:id', updateCredencialEmpresa);
router.delete('/:id', deleteCredencialEmpresa);

router.get('/mostraSetoresDisponiveis/:empresa_id/:evento_id', mostraSetoresDisponiveis);

export default router;
