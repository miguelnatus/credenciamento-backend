import express from 'express';
import {
    createCredencialEmpresaZonas,
    getAllCredenciaisEmpresaZonas,
    searchCredenciaisEmpresaZonas,
    updateCredencialEmpresaZonas,
    deleteCredencialEmpresaZonas,
    mostraZonasDisponiveis
} from '../controllers/credencialEmpresaZonaController.js';

import Joi from 'joi';

// Middleware de validação
const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

// Esquema de validação para criação de credenciais de zona
const credencialZonaSchema = Joi.object({
    ces_id: Joi.number().required(),
    zona_id: Joi.number().required(),
    limite: Joi.number().min(0).optional(),
});

const router = express.Router();

// Rotas
router.post('/', validate(credencialZonaSchema), createCredencialEmpresaZonas);
router.get('/', getAllCredenciaisEmpresaZonas);
router.get('/mostraZonasDisponiveis/:ces_id', mostraZonasDisponiveis);
router.get('/:ces_id', searchCredenciaisEmpresaZonas);
router.put('/:id', validate(credencialZonaSchema), updateCredencialEmpresaZonas);
router.delete('/:id', deleteCredencialEmpresaZonas);

export default router;
