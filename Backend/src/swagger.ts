import swaggerJsdoc from "swagger-jsdoc";

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
        url: "http://localhost:4000",
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // ajusta si usas otra estructura
});
