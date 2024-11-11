const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
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

app.use(express.json());

// Importar e configurar as rotas
const loginRoutes = require('./routes/login');
const registerRoutes = require('./routes/register');
const usuarioRoutes = require('./routes/usuario');
const eventoRoutes = require('./routes/evento');

// Rotas sem autenticação
app.use('/api/register', registerRoutes);
app.use('/api/login', loginRoutes); 

// Rotas com autenticação
const authenticateToken = require('./middleware/authenticateToken');
app.use('/api/usuario', authenticateToken, usuarioRoutes);
app.use('/api/eventos', authenticateToken, eventoRoutes);



app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
