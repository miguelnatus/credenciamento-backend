import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import routes from './routes/index.js';
import authenticateToken from './middlewares/authenticateToken.js';
import loginRoutes from './routes/login.js';
import registerRoutes from './routes/register.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware para servir imagens estáticas
app.use('/images', express.static(path.join(process.cwd(), 'images')));

// Configuração do Rate Limiter Global
const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,  // 1 minuto
  max: 1000,                // Permite 1000 requisições por minuto por IP
  message: {
    status: 429,
    message: 'Muitas requisições. Por favor, tente novamente mais tarde.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// Configuração do CORS
const allowedOrigins = ['http://localhost:3000', 'https://credenciamento.pro'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Não permitido pelo CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

// Middleware para parse de JSON e cookies
app.use(express.json());
app.use(cookieParser());

// Rotas públicas
app.use('/api/login', loginRoutes);
app.use('/api/register', registerRoutes);

// Middleware de autenticação para rotas protegidas
app.use('/api', authenticateToken);

// Rotas protegidas
app.use('/api', routes);

// Middleware para capturar rotas não encontradas
app.use((req, res, next) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Erro interno do servidor' });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
