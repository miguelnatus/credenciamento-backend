const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const routes = require('./routes'); // Importa o index.js automaticamente
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware para servir imagens estáticas
app.use('/images', express.static(path.join(__dirname, 'images')));

// Configuração do CORS
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

// Middleware para parse de JSON
app.use(express.json());

// Usa as rotas centralizadas no arquivo index.js
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
