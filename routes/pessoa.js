import express from 'express';
import {
    createPessoa,
    getAllPessoas,
    getPessoaById,
    updatePessoa,
    deletePessoa,
    getPessoasByEmpresaId,
    verificar
} from '../controllers/pessoaController.js';

const router = express.Router();

router.post('/', createPessoa);
router.get('/', getAllPessoas);
router.get('/:id', getPessoaById);
router.put('/:id', updatePessoa);
router.delete('/:id', deletePessoa);

router.get('/empresa/:empresaId', getPessoasByEmpresaId);
router.get('/verificar/:documento/:tipo', verificar);

export default router;
