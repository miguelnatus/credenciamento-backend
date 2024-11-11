const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

function authenticateToken(req, res, next) {
  console.log("Rota solicitada:", req.path);  // Para verificar a rota
  if (req.path === '/api/register' || req.path === '/api/login') {
    return next();
  }

  const authHeader = req.headers['authorization'];
  // console.log("Cabeçalho de autorização:", authHeader);  // Para ver o cabeçalho

  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    console.log("Token não fornecido");
    return res.status(403).json({ message: 'Acesso negado: Token não fornecido' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
        console.log("Token inválido:", err.message);
        return res.status(403).json({ message: 'Acesso negado: Token inválido' });
    }
    req.user = user;
    console.log("Token verificado com sucesso, prosseguindo para a próxima função...");
    next();
  });
}

module.exports = authenticateToken;
