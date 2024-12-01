import express from 'express';
import rateLimit from 'express-rate-limit'; // Middleware para limitar requisições
import { authenticateToken } from '../middlewares/index.js'; // Middleware para autenticação
import verifyCsrfToken from '../middlewares/verifyCsrfToken.js'; // Middleware para CSRF

// Importação de rotas públicas
import loginRoutes from './login.js';
import registerRoutes from './register.js';
import authRoutes from './auth.js';
import refreshTokenRoutes from './refresh-token.js';

// Importação de rotas protegidas
import usuarioRoutes from './usuario.js';
import eventoRoutes from './evento.js';
import produtoraRoutes from './produtora.js';
import empresaRoutes from './empresa.js';
import setorRoutes from './setor.js';
import zonaRoutes from './zona.js';
import credencialRoutes from './credenciais.js';
import credencialZonaRoutes from './credencialZona.js';
import credencialEmpresaRoutes from './credencialEmpresa.js';
import credencialEmpresaZonaRoutes from './credencialEmpresaZonas.js';
import pessoaRoutes from './pessoa.js';
import buscaRoutes from './busca.js';
import empresaDocumentoRoutes from './empresaDocumento.js';

// Configuração do rate limiter para login e registro
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // Limita a 10 requisições por IP nesse intervalo
  message: { message: 'Muitas tentativas de login ou registro. Tente novamente mais tarde.' },
  standardHeaders: true, // Envia informações de limite nos headers RateLimit-*
  legacyHeaders: false, // Desativa os headers X-RateLimit-*
});

// Inicializa o roteador
const router = express.Router();

// Rota inicial para verificar se a API está funcionando
router.get('/', (req, res) => {
  res.send('API funcionando');
});

// Rota de saúde para monitoramento
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: Date.now() });
});

// Rotas públicas (sem autenticação)
router.use('/login', authLimiter, loginRoutes);
router.use('/register', authLimiter, registerRoutes);
router.use('/auth', authRoutes);
router.use('/refresh-token', refreshTokenRoutes);

// Rotas protegidas com autenticação e CSRF
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

export default router;
