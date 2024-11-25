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
const produtoraRoutes = require('./routes/produtora');
const empresasRoutes = require('./routes/empresa');
const setorRoutes = require('./routes/setor');
const zonaRoutes = require('./routes/zona');
const credencialRoutes = require('./routes/credenciais');
const credencialEmpresaRoutes = require('./routes/credencialEmpresa');

// Rotas sem autenticação
app.use('/api/register', registerRoutes);
app.use('/api/login', loginRoutes); 

// Rotas com autenticação
const authenticateToken = require('./middleware/authenticateToken');
app.use('/api/usuario', authenticateToken, usuarioRoutes);
app.use('/api/eventos', authenticateToken, eventoRoutes);
app.use('/api/produtoras', authenticateToken, produtoraRoutes); 
app.use('/api/empresas', authenticateToken, empresasRoutes);
app.use('/api/setores', authenticateToken, setorRoutes);
app.use('/api/zonas', authenticateToken, zonaRoutes);
app.use('/api/credenciais', authenticateToken, credencialRoutes);
app.use('/api/credencialempresa', authenticateToken, credencialEmpresaRoutes);


app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});