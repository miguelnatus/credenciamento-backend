import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY;

function authenticateToken(req, res, next) {
  const token = req.cookies?.auth_token;

  if (!token) {
    return res.status(403).json({ message: 'Acesso negado: Token não fornecido' });
  }

  // Verifica o token com o algoritmo HS512
  jwt.verify(token, SECRET_KEY, { algorithms: ['HS512'] }, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Acesso negado: Token inválido' });
    }
    req.user = user; // Adiciona os dados do usuário ao objeto `req`
    next();
  });
}

export default authenticateToken;
