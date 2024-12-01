import express from 'express';

import {
    getAllProdutoras,
    createProdutora,
    getProdutoraById,
    updateProdutora,
    deleteProdutora
  } from '../controllers/produtoraController.js';
  
  const router = express.Router();
  
  router.get('/', getAllProdutoras);
  router.post('/', createProdutora);
  router.get('/:id', getProdutoraById);
  router.put('/:id', updateProdutora);
  router.delete('/:id', deleteProdutora);
  
  export default router;
  