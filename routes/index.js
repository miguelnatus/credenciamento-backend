const express = require('express');
const rateLimit = require('express-rate-limit'); // Importa express-rate-limit
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');
const verifyCsrfToken = require('../middlewares/verifyCsrfToken'); // Importa o middleware para CSRF

// Rotas individuais
const loginRoutes = require('./login');
const registerRoutes = require('./register');
const authRoutes = require('./auth'); // Importa as rotas de autenticação
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
const buscaRoutes = require('./busca');
const empresaDocumentoRoutes = require('./empresaDocumento');

// Configuração do rate limiter para login e registro
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 10, // Limita a 10 requisições por IP nesse intervalo
    message: { message: 'Muitas tentativas de login ou registro. Tente novamente mais tarde.' },
    standardHeaders: true, // Envia informações de limite nos headers RateLimit-*
    legacyHeaders: false, // Desativa os headers X-RateLimit-*
});

// Rota inicial para verificar a API
router.get('/', (req, res) => {
    res.send('API funcionando');
});

// Rotas públicas com rate limiter
router.use('/login', authLimiter, loginRoutes); // Aplica o rate limiter ao login
router.use('/register', authLimiter, registerRoutes); // Aplica o rate limiter ao registro
router.use('/auth', authRoutes);
router.use('/refresh-token', refreshTokenRoutes);

// Rotas protegidas com validação de CSRF e autenticação
router.use('/usuario', verifyCsrfToken, authenticateToken, usuarioRoutes);
router.use('/eventos', verifyCsrfToken, authenticateToken, eventoRoutes);
router.use('/produtoras', verifyCsrfToken, authenticateToken, produtoraRoutes);
router.use('/empresas', verifyCsrfToken, authenticateToken, empresaRoutes);
router.use('/setores', verifyCsrfToken, authenticateToken, setorRoutes);
router.use('/zonas', verifyCsrfToken, authenticateToken, zonaRoutes);
router.use('/credenciais', verifyCsrfToken, authenticateToken, credencialRoutes);
router.use('/credencialzona', verifyCsrfToken, authenticateToken, credencialZonaRoutes);
router.use('/credencialempresa', verifyCsrfToken, authenticateToken, credencialEmpresaRoutes);
router.use('/credencialempresazona', verifyCsrfToken, authenticateToken, credencialEmpresaZonaRoutes);
router.use('/pessoas', verifyCsrfToken, authenticateToken, pessoaRoutes);
router.use('/busca', verifyCsrfToken, authenticateToken, buscaRoutes);
router.use('/empresadocumento', verifyCsrfToken, authenticateToken, empresaDocumentoRoutes);

module.exports = router;
