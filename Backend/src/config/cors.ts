import { CorsOptions } from "cors";

const getConfiguredOrigins = () =>
  [process.env.FRONTEND_URL, ...(process.env.CORS_ORIGINS ?? "").split(",")]
    .map((origin) => origin?.trim())
    .filter((origin): origin is string => Boolean(origin));

export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    // Permitir requests sin origin (Postman, Railway health check)
    if (!origin) {
      return callback(null, true);
    }
    if (getConfiguredOrigins().includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("error de cors"));
  },
  credentials: true,
};
