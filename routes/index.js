const express = require('express');
const router = express.Router();

// Exemplo de uma rota simples
router.get('/', (req, res) => {
    res.send('API funcionando');
});

module.exports = router;
