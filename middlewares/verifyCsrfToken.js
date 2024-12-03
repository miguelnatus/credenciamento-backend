export const verifyCsrfToken = (req, res, next) => {
  const csrfToken = req.cookies?.csrf_token;
  const csrfHeader = req.headers["x-csrf-token"];

  if (!csrfToken || csrfToken !== csrfHeader) {
    console.error("[CSRF] Token CSRF inválido ou ausente.");
    return res.status(403).json({ error: "Acesso negado: CSRF token inválido." });
  }

  console.log("[CSRF] Token CSRF válido.");
  next();
};
