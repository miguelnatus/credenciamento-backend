import rateLimit from 'express-rate-limit';

// Configuração básica de Rate Limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 100, // Máximo de 100 requisições por IP
  message: { message: 'Muitas requisições. Por favor, tente novamente mais tarde.' }, // Mensagem de erro
  standardHeaders: true, // Retorna informações de limite nos headers `RateLimit-*`
  legacyHeaders: false, // Desativa os headers `X-RateLimit-*` antigos
});

export default limiter;
