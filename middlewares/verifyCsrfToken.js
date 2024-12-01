const verifyCsrfToken = (req, res, next) => {
    const csrfToken = req.cookies?.csrf_token; // Obtém o token CSRF do cookie
    const csrfHeader = req.headers['x-csrf-token']; // Obtém o token CSRF do cabeçalho
  
    if (!csrfToken || !csrfHeader || csrfToken !== csrfHeader) {
      return res.status(403).json({ message: 'Token CSRF inválido ou ausente' });
    }
  
    next();
  };
  
  export default verifyCsrfToken;
  