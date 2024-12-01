import { configureCors } from './corsConfig.js';
import { globalRateLimiter } from './rateLimiter.js';
import { serveStaticFiles } from './staticFiles.js';
import { errorHandler } from './errorHandler.js';

export const configureMiddlewares = (app) => {
  // Middleware para servir arquivos estáticos
  serveStaticFiles(app);

  // Middleware de Rate Limiter Global
  app.use(globalRateLimiter);

  // Configuração de CORS
  configureCors(app);
};

// Exporta o middleware de autenticação para ser usado manualmente nas rotas
export { errorHandler };
export { default as authenticateToken } from './authenticateToken.js';

