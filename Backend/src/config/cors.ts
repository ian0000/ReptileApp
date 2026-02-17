import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    const allowedOrigin = process.env.FRONTEND_URL;

    // Permitir requests sin origin (Postman, Railway health check)
    if (!origin) {
      return callback(null, true);
    }
    if (origin === allowedOrigin || origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }

    return callback(new Error("error de cors"));
  },
  credentials: true,
};
