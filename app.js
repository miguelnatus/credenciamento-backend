import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware para CORS
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://credenciamento.pro'], // Domínios permitidos
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
    credentials: true, // Permite envio de cookies
  })
);

// Middleware para parse de JSON
app.use(express.json());

// Middleware para parse de cookies
app.use(cookieParser());

// Middleware para debug de requisições (opcional)
app.use((req, res, next) => {
  console.log('Método:', req.method);
  console.log('Rota acessada:', req.originalUrl);
  console.log('Headers recebidos:', req.headers);
  console.log('Cookies recebidos:', req.cookies);
  console.log('Body recebido:', req.body);
  next();
});

// Configuração de rotas
app.use('/api', routes);

// Middleware para capturar rotas não encontradas
app.use((req, res, next) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Middleware para tratar erros (manter no final)
app.use((err, req, res, next) => {
  console.error('Erro interno do servidor:', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Erro interno do servidor' });
});

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
