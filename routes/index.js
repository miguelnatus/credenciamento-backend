// const express = require('express');
// const router = express.Router();

// // Exemplo de uma rota simples
// router.get('/', (req, res) => {
//     res.send('API funcionando');
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');

// Rotas individuais
const loginRoutes = require('./login');
const registerRoutes = require('./register');
const usuarioRoutes = require('./usuario');
const eventoRoutes = require('./evento');
const produtoraRoutes = require('./produtora');
const empresaRoutes = require('./empresa');
const setorRoutes = require('./setor');
const zonaRoutes = require('./zona');
const credencialRoutes = require('./credenciais');
const credencialZonaRoutes = require('./credencialZona');
const credencialEmpresaRoutes = require('./credencialEmpresa');
const credencialEmpresaZonaRoutes = require('./credencialEmpresaZonas');
const pessoaRoutes = require('./pessoa');
const refreshTokenRoutes = require('./refresh-token');

// Rota inicial para verificar a API
router.get('/', (req, res) => {
    res.send('API funcionando');
});

// Rotas públicas
router.use('/login', loginRoutes);
router.use('/register', registerRoutes);
router.use('/refresh-token', refreshTokenRoutes);

// Rotas protegidas
router.use('/usuario', authenticateToken, usuarioRoutes);
router.use('/eventos', authenticateToken, eventoRoutes);
router.use('/produtoras', authenticateToken, produtoraRoutes);
router.use('/empresas', authenticateToken, empresaRoutes);
router.use('/setores', authenticateToken, setorRoutes);
router.use('/zonas', authenticateToken, zonaRoutes);
router.use('/credenciais', authenticateToken, credencialRoutes);
router.use('/credencialzona', authenticateToken, credencialZonaRoutes);
router.use('/credencialempresa', authenticateToken, credencialEmpresaRoutes);
router.use('/credencialempresazona', authenticateToken, credencialEmpresaZonaRoutes);
router.use('/pessoas', authenticateToken, pessoaRoutes);

module.exports = router;

