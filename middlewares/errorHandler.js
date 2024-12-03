export const errorHandler = (err, req, res, next) => {
    console.error(`[Erro] ${err.message} na rota ${req.method} ${req.originalUrl}`);
    res.status(err.status || 500).json({
      error: err.message || 'Erro interno do servidor',
    });
  };