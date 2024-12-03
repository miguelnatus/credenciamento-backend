import cors from "cors";

export const configureCors = (app) => {
  const allowedOrigins = ["http://localhost:3000", "https://credenciamento.pro"];

  app.use((req, res, next) => {
    // Log dos cabeçalhos da requisição para depuração
    console.log("Cabeçalhos da Requisição Recebida:");
    console.log(req.headers);
    next();
  });

  app.use(
    cors({
      origin: (origin, callback) => {
        console.log("Origin Recebida:", origin);
        if (!origin || allowedOrigins.includes(origin)) {
          // Permitir requisições sem 'Origin'
          console.log("Origem permitida pelo CORS");
          callback(null, true);
        } else {
          console.error(`Origem ${origin} não permitida pelo CORS`);
          callback(new Error("Não permitido pelo CORS"));
        }
      },
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true, // Permitir cookies
    })
  );
  
  
};
