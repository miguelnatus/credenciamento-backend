const verifyCsrfToken = (req, res, next) => {
    const csrfCookie = req.cookies.csrf_token;
    const csrfHeader = req.headers['x-csrf-token'];

    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
        return res.status(403).json({ message: 'Acesso negado: CSRF token inválido' });
    }

    next();
};

export default verifyCsrfToken;
