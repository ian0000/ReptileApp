import swaggerJsdoc from "swagger-jsdoc";

const apiPublicUrl = process.env.API_PUBLIC_URL || "http://localhost:4000";

export const swaggerDocument = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Reptiles API",
      version: "1.0.0",
      description: "Documentación de la API de reptiles",
    },
    servers: [
      {
        url: apiPublicUrl,
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // ajusta si usas otra estructura
});
