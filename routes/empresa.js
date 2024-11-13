const express = require('express');
const router = express.Router();
const empresaController = require('../controllers/empresaController');

router.post('/', empresaController.createCompany);
router.get('/', empresaController.getAllCompanies);
router.get('/:id', empresaController.getCompanyById);   
router.put('/:id', empresaController.updateCompany);
router.delete('/:id', empresaController.deleteCompany);

module.exports = router;