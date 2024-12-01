import express from 'express';
import {
  getAllCredenciais,
  createOrUpdateCredencial,
  getCredencialById,
  deleteCredencial,
} from '../controllers/credencialController.js';

const router = express.Router();

router.get('/', getAllCredenciais);
router.post('/', createOrUpdateCredencial);
router.get('/:id', getCredencialById);
router.delete('/:id', deleteCredencial);

export default router;
