import rateLimit from 'express-rate-limit';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import path from 'path';

export const configureMiddlewares = (app) => {
  // Middleware para servir imagens estáticas
  app.use('/images', express.static(path.join(process.cwd(), 'images')));

  // Rate Limiter Global
  const globalLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 1000, // Permite 1000 requisições por minuto
    message: {
      status: 429,
      message: 'Muitas requisições. Tente novamente mais tarde.',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(globalLimiter);

  // Configuração de CORS com múltiplas origens
  const allowedOrigins = [
    'http://localhost:3000', // Ambiente de desenvolvimento
    'https://credenciamento.pro',   // Ambiente de produção
  ];

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

  // Middlewares gerais
  app.use(express.json());
  app.use(cookieParser());
};

// Middleware para tratamento de erros
export const errorHandler = (err, req, res, next) => {
  console.error(err.message); // Log do erro
  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor',
  });
};
