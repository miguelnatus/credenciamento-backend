const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit'); // Importa express-rate-limit
require('dotenv').config();
const path = require('path');
const routes = require('./routes');
const authenticateToken = require('./middlewares/authenticateToken');
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware para servir imagens estáticas
app.use('/images', express.static(path.join(__dirname, 'images')));

// Configuração do Rate Limiter Global
const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 1000, // Permite 1000 requisições por minuto por IP
  message: { message: 'Muitas requisições. Por favor, tente novamente mais tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Aplica o rate limiter global
app.use(globalLimiter);

// Configuração do CORS
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

// Middleware para parse de JSON e cookies
app.use(express.json());
app.use(cookieParser());

// Middleware de autenticação para rotas protegidas
app.use(authenticateToken);

// Rotas centralizadas
app.use('/api', routes);

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err.message);
  res.status(err.status || 500).json({ error: 'Erro interno do servidor' });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
