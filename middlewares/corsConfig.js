import cors from "cors";

export const configureCors = (app) => {
  const allowedOrigins = ["http://localhost:3000", "https://credenciamento.pro"];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Não permitido pelo CORS"));
        }
      },
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true, // Permitir envio de cookies e autenticação
    })
  );
};
