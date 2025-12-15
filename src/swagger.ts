import swaggerJsdoc from "swagger-jsdoc";
import path from "path";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Docs",
      version: "1.0.0",
    },
  },
  apis: [path.join(process.cwd(), "src/app/api/**/*.ts")],
};

export const swaggerSpec = swaggerJsdoc(options);
